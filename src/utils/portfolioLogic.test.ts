import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ABOUT_STORY_PARAGRAPHS,
  getFullAboutText,
  getTldrAboutText,
  MULTILINGUAL_GREETINGS,
  NAV_LINKS,
  PORTFOLIO_COPY,
  SELECTED_WORK_PROJECTS,
} from '../config/portfolio';
import {
  createInitialTypewriterState,
  getCurrentDisplayText,
  getNextDelayMs,
  segmentGraphemes,
  stepTypewriterState,
} from './typewriter';
import {
  computeNavbarWidthPx,
  computeSmoothNavbarProgressStep,
  computeSmoothScrollStep,
  computeSyncedNavbarProgress,
  easeNavbarProgress,
  formatISTTime,
  NAVBAR_WIDTHS,
  SYNCED_NAVBAR_CONFIG,
} from './navbarState';
import {
  computePolaroidTransform,
  isPolaroidSettled,
  lerpPolaroidTransform,
  POLAROID_DEFAULTS,
} from './polaroidPhysics';
import {
  evaluateFigmaTimeline,
  getSayHiHoverPoint,
  TIMELINE_SEGMENTS,
  TOTAL_CYCLE_DURATION_MS,
  type HeroCursorAnchors,
} from './figmaCursorTimeline';
import { HOBBY_FOLDERS, OTHER_WORLD_COPY, OTHER_WORLD_STAMPS } from '../config/hobbies';
import {
  computeDeskViewBox,
  computeFixedDeskMaxScale,
  computeRunwayProgress,
  computeSequentialStampIndex,
  DESK_SVG_METRICS,
  evaluateOtherWorldFrame,
  OTHER_WORLD_TIMELINE,
} from './otherWorldTimeline';

test('MULTILINGUAL_GREETINGS, NAV_LINKS, and contact details match requested configuration', () => {
  const texts = MULTILINGUAL_GREETINGS.map((g) => g.text);
  assert.deepEqual(texts, [
    'Hello',
    'Hola',
    'Olá',
    'Ciao',
    'Hallo',
    'Bonjour',
    'வணக்கம்',
    'こんにちは',
    'നമസ്കാരം',
    'ನಮಸ್ಕಾರ',
    'नमस्ते',
    'నమస్కారం',
  ]);
  const tamil = MULTILINGUAL_GREETINGS.find((g) => g.text === 'வணக்கம்');
  const hindi = MULTILINGUAL_GREETINGS.find((g) => g.text === 'नमस्ते');
  const portuguese = MULTILINGUAL_GREETINGS.find((g) => g.text === 'Olá');
  assert.equal(tamil?.englishVersion, 'vanakkam');
  assert.equal(hindi?.englishVersion, 'namaste');
  assert.equal(portuguese?.englishVersion, 'ola');
  assert.ok(MULTILINGUAL_GREETINGS.every((g) => g.englishVersion.length > 0));
  assert.deepEqual(
    NAV_LINKS.map((l) => l.label),
    ['About', 'Work', 'Workflow'],
  );
  assert.equal(PORTFOLIO_COPY.brandName, 'Karke');
  assert.equal(PORTFOLIO_COPY.nameHeading, 'I am Karthikeyan');
  assert.equal(PORTFOLIO_COPY.contactEmail, 'karthikramesh.work@gmail.com');
  assert.equal(PORTFOLIO_COPY.linkedinUrl, 'https://www.linkedin.com/in/karke');
  assert.equal(PORTFOLIO_COPY.behanceUrl, 'https://www.behance.net/karthikeyan_ramesh');
  assert.equal(PORTFOLIO_COPY.whatsappUrl, 'https://wa.me/919498875422');
  assert.equal(PORTFOLIO_COPY.contactPhoneHref, 'tel:+919498875422');
  assert.equal(PORTFOLIO_COPY.resumePdfUrl, '/assets/aistudio/Karthikeyan_resume_badf8dc1.pdf');
  assert.equal(PORTFOLIO_COPY.resumeDownloadName, 'Karthikeyan_Ramesh_Resume.pdf');
});

test('segmentGraphemes keeps Indic combining marks intact without splitting clusters', () => {
  // Tamil 'வணக்கம்' has 7 code points including virama combining mark on 'க்' & 'ம்'
  const tamilClusters = segmentGraphemes('வணக்கம்');
  assert.equal(tamilClusters.join(''), 'வணக்கம்');
  assert.ok(tamilClusters.length < 'வணக்கம்'.length, 'Tamil should group combining marks into visual clusters');

  // Hindi 'नमस्ते' combines 'स्' + 'ते'
  const hindiClusters = segmentGraphemes('नमस्ते');
  assert.equal(hindiClusters.join(''), 'नमस्ते');
  assert.ok(hindiClusters.length < 'नमस्ते'.length, 'Hindi should group combining marks into visual clusters');

  // Malayalam, Kannada, Telugu round-trip losslessly
  for (const sample of ['നമസ്കാരം', 'ನಮಸ್ಕಾರ', 'నమస్కారం']) {
    const clusters = segmentGraphemes(sample);
    assert.equal(clusters.join(''), sample);
    assert.ok(clusters.length > 0);
  }
});

test('typewriter state machine cycles cleanly from Hello through Guten Tag and loops back', () => {
  const words = MULTILINGUAL_GREETINGS.map((g) => g.text);
  let state = createInitialTypewriterState(false);

  // Type 'Hello' (5 graphemes)
  for (let i = 0; i < 5; i++) {
    state = stepTypewriterState(words, state);
  }
  assert.equal(getCurrentDisplayText(words, state), 'Hello');
  assert.equal(state.phase, 'pausing');
  assert.ok(getNextDelayMs(state.phase) > getNextDelayMs('typing'));

  // Pause -> deleting
  state = stepTypewriterState(words, state);
  assert.equal(state.phase, 'deleting');

  // Delete 5 chars -> switching
  for (let i = 0; i < 5; i++) {
    state = stepTypewriterState(words, state);
  }
  assert.equal(getCurrentDisplayText(words, state), '');
  assert.equal(state.phase, 'switching');

  // Switch -> wordIndex 1 (வணக்கம்)
  state = stepTypewriterState(words, state);
  assert.equal(state.wordIndex, 1);
  assert.equal(state.phase, 'typing');

  // Wrapping from last greeting ('Guten Tag', index 9) back to 0 ('Hello')
  const wrapState = stepTypewriterState(words, {
    wordIndex: words.length - 1,
    charCount: 0,
    phase: 'switching',
  });
  assert.equal(wrapState.wordIndex, 0);
  assert.equal(wrapState.phase, 'typing');
});

test('Smooth scroll and secondary navbar damping glide slowly and settle cleanly', () => {
  const step1 = computeSmoothScrollStep(0, 300, 16.667);
  // Slower damping (< 6% per 60fps frame) ensures unhurried, silky scroll glide
  assert.ok(step1.nextY > 0 && step1.nextY < 20, `Expected gentle single-frame scroll step, got ${step1.nextY}`);
  assert.equal(step1.settled, false);

  const settledStep = computeSmoothScrollStep(299.9, 300, 16.667);
  assert.equal(settledStep.nextY, 300);
  assert.equal(settledStep.settled, true);

  const navStep1 = computeSmoothNavbarProgressStep(0, 1, 16.667);
  assert.ok(navStep1.nextProgress > 0 && navStep1.nextProgress < 0.08, `Expected slow navbar frame step, got ${navStep1.nextProgress}`);
  assert.equal(navStep1.settled, false);

  const navSettled = computeSmoothNavbarProgressStep(0.9995, 1, 16.667);
  assert.equal(navSettled.nextProgress, 1);
  assert.equal(navSettled.settled, true);
});

test('Synced navbar width has exact +100px relaxed default space and smooth sine easing', () => {
  assert.equal(NAVBAR_WIDTHS.expandedPx - NAVBAR_WIDTHS.compactPx, 100);
  assert.ok(NAVBAR_WIDTHS.expandedPx < 1000, 'Removed 1000px max-width cap');
  assert.equal(easeNavbarProgress(0), 0);
  assert.ok(Math.abs(easeNavbarProgress(0.5) - 0.5) < 1e-12);
  assert.equal(easeNavbarProgress(1), 1);

  // Expanded at top (progress = 0)
  let progress = computeSyncedNavbarProgress(0, 0, 0);
  assert.equal(progress, 0);
  assert.equal(computeNavbarWidthPx(progress), NAVBAR_WIDTHS.expandedPx);

  // Halfway down travel range -> smoothly halfway shrunk (+50px)
  const halfTravel = SYNCED_NAVBAR_CONFIG.travelRangePx / 2;
  progress = computeSyncedNavbarProgress(progress, halfTravel, 0);
  assert.equal(progress, 0.5);
  assert.equal(computeNavbarWidthPx(progress), NAVBAR_WIDTHS.compactPx + 50);

  // Full travel range down -> fully compact (progress = 1)
  progress = computeSyncedNavbarProgress(progress, SYNCED_NAVBAR_CONFIG.travelRangePx, halfTravel);
  assert.equal(progress, 1);
  assert.equal(computeNavbarWidthPx(progress), NAVBAR_WIDTHS.compactPx);

  // Scrolling up mid-page smoothly expands width back in sync
  progress = computeSyncedNavbarProgress(progress, 340, 340 + halfTravel);
  assert.equal(progress, 0.5);
  assert.equal(computeNavbarWidthPx(progress), NAVBAR_WIDTHS.compactPx + 50);

  // Returning to top forces progress back to 0 (fully expanded)
  progress = computeSyncedNavbarProgress(progress, 4, 340);
  assert.equal(progress, 0);
  assert.equal(computeNavbarWidthPx(progress), NAVBAR_WIDTHS.expandedPx);
});

test('Polaroid transform keeps rotation constant on hover and applies subtle parallax + smooth lerp', () => {
  const rest = computePolaroidTransform(false, 0.5, -0.5, false);
  assert.equal(rest.rotateZ, POLAROID_DEFAULTS.restingRotationDeg);
  assert.equal(rest.frameOffsetX, 0);
  assert.equal(rest.frameOffsetY, 0);
  assert.equal(rest.translateY, 0);

  const hoverRightTop = computePolaroidTransform(true, 1.8, -2.5, false);
  assert.equal(hoverRightTop.rotateZ, POLAROID_DEFAULTS.restingRotationDeg);
  assert.equal(hoverRightTop.frameOffsetX, POLAROID_DEFAULTS.maxFrameParallaxPx);
  assert.equal(hoverRightTop.frameOffsetY, -POLAROID_DEFAULTS.maxFrameParallaxPx);
  assert.equal(hoverRightTop.translateY, POLAROID_DEFAULTS.hoverLiftPx);
  assert.equal(hoverRightTop.imageOffsetX, -POLAROID_DEFAULTS.maxImageParallaxPx);
  assert.equal(hoverRightTop.imageOffsetY, POLAROID_DEFAULTS.maxImageParallaxPx);

  const mid = lerpPolaroidTransform(rest, hoverRightTop, 0.5);
  assert.equal(mid.rotateZ, POLAROID_DEFAULTS.restingRotationDeg);
  assert.equal(mid.frameOffsetX, POLAROID_DEFAULTS.maxFrameParallaxPx / 2);
  assert.equal(isPolaroidSettled(mid, hoverRightTop), false);
  assert.equal(isPolaroidSettled(hoverRightTop, hoverRightTop), true);

  const reduced = computePolaroidTransform(true, 1, 1, true);
  assert.equal(reduced.rotateZ, POLAROID_DEFAULTS.restingRotationDeg);
  assert.equal(reduced.frameOffsetX, 0);
  assert.equal(reduced.imageOffsetX, 0);
  assert.equal(reduced.scale, 1);
});

test('formatISTTime converts UTC timestamp cleanly to Asia/Kolkata HH:MM', () => {
  // 2026-11-18T06:41:00Z is 12:11 IST (+05:30)
  const sampleDate = new Date('2026-11-18T06:41:00.000Z');
  assert.equal(formatISTTime(sampleDate), '12:11');
});

test('Figma cursor timeline highlights role, pauses 1s near Say hi, and double-clicks Polaroid', () => {
  const anchors: HeroCursorAnchors = {
    roleRect: { left: 160, top: 380, width: 250, height: 28 },
    sayHiRect: { left: 160, top: 530, width: 176, height: 54 },
    polaroidCaptionRect: { left: 840, top: 610, width: 90, height: 24 },
    containerWidth: 1440,
    containerHeight: 820,
  };

  // Verify Step 2 hover is exactly 1000ms and Step 3 double-click interval is 150-250ms
  const hoverSeg = TIMELINE_SEGMENTS.find((s) => s.phase === 'step2-hover');
  const click1Seg = TIMELINE_SEGMENTS.find((s) => s.phase === 'step3-click1');
  assert.equal(hoverSeg?.durationMs, 1000);
  assert.ok(click1Seg && click1Seg.durationMs >= 150 && click1Seg.durationMs <= 250);

  const phaseMidMs = (phaseName: string): number => {
    let acc = 0;
    for (const seg of TIMELINE_SEGMENTS) {
      if (seg.phase === phaseName) return acc + seg.durationMs * 0.5;
      acc += seg.durationMs;
    }
    throw new Error(`Unknown phase: ${phaseName}`);
  };

  // Step 1: Role highlight drags progressively
  const dragMid = evaluateFigmaTimeline(phaseMidMs('step1-drag'), anchors);
  assert.equal(dragMid.phase, 'step1-drag');
  assert.ok(dragMid.roleHighlightProgress > 0.3 && dragMid.roleHighlightProgress < 0.7);
  assert.equal(dragMid.roleHighlightOpacity, 1);
  assert.equal(dragMid.polaroidSelected, false);

  // Step 2: Simply pauses near "Say hi" for 1s without pressing/drawing
  const hoverMid = evaluateFigmaTimeline(phaseMidMs('step2-hover'), anchors);
  const hoverAnchor = getSayHiHoverPoint(anchors.sayHiRect);
  assert.equal(hoverMid.phase, 'step2-hover');
  assert.equal(hoverMid.isPressing, false);
  assert.equal(hoverMid.roleHighlightOpacity, 0);
  assert.ok(Math.hypot(hoverMid.cursor.x - hoverAnchor.x, hoverMid.cursor.y - hoverAnchor.y) < 5);

  // Step 3: Two distinct clicks trigger Polaroid layer selection
  const click1 = evaluateFigmaTimeline(phaseMidMs('step3-click1'), anchors);
  const click2 = evaluateFigmaTimeline(phaseMidMs('step3-click2'), anchors);
  assert.equal(click1.clickPulseId, 1);
  assert.equal(click1.polaroidSelected, false);
  assert.equal(click2.clickPulseId, 2);
  assert.equal(click2.polaroidSelected, true);

  // Seamless loop: elapsedMs === TOTAL_CYCLE_DURATION_MS wraps cleanly to start
  const startFrame = evaluateFigmaTimeline(0, anchors);
  const wrappedFrame = evaluateFigmaTimeline(TOTAL_CYCLE_DURATION_MS, anchors);
  assert.equal(wrappedFrame.phase, startFrame.phase);
  assert.deepEqual(wrappedFrame.cursor, startFrame.cursor);
});

test('About Story & TL;DR paragraphs preserve full narrative and exact TL;DR highlights', () => {
  assert.equal(ABOUT_STORY_PARAGRAPHS.length, 5);
  const fullStory = getFullAboutText();
  assert.ok(fullStory.startsWith('It all started in 2015, when my dad bought our first Android phone.'));
  assert.ok(fullStory.includes('Photoshop competition despite knowing little more than the Pen Tool'));
  assert.ok(fullStory.includes('join Sciflare as a UI UX Designer.'));
  assert.ok(fullStory.endsWith('customizing Android phones as a kid.'));

  const tldr = getTldrAboutText();
  assert.ok(tldr.includes('I was just a curious kid who went down a rabbit hole of apps'));
  assert.ok(tldr.includes('Looking back, I was probably doing UI exploration before I even knew what UI was.'));
  assert.ok(tldr.includes('I realized that building digital products combined everything I loved: how things work, how they look, and how they make people feel.'));
  assert.ok(tldr.includes('That realization eventually led me to switch careers and join Sciflare as a UI UX Designer.'));
  assert.equal(tldr.includes('Photoshop competition'), false);
  assert.equal(tldr.includes('DDC as a UI Developer'), false);
});

test('SELECTED_WORK_PROJECTS provides 4 authentic projects with complete case study details', () => {
  assert.equal(SELECTED_WORK_PROJECTS.length, 4);
  const ids = new Set(SELECTED_WORK_PROJECTS.map((p) => p.id));
  assert.equal(ids.size, 4);

  assert.deepEqual(
    SELECTED_WORK_PROJECTS.map((p) => p.company),
    ['GETSET11', 'SCIFLARE', 'INVICTUS11', 'DEDUCTIVECLOUDS'],
  );

  for (const project of SELECTED_WORK_PROJECTS) {
    assert.ok(project.displayName.length > 0);
    assert.ok(project.title.length > 10);
    assert.ok(project.summary.length > 40);
    assert.ok(project.highlightBadge.length > 5);
    assert.equal(project.badges.length, 2);
    assert.ok(project.ctaLabel.length > 0);
    assert.ok(project.caseStudyPoints.length >= 3);
    assert.ok(project.deliverables.length >= 2);
  }
});

test('Other World scroll timeline zooms hand-drawn desk into laptop screen, loops stamps 01->02->03 until zoomEnd, then cross-fades hobbies', () => {
  const maxScale = computeFixedDeskMaxScale(1440, 900);
  assert.ok(maxScale >= 6.0 && maxScale <= 12.0, `Expected crisp laptop-bezel max scale, got ${maxScale}`);

  // Native SVG viewBox centers on desk at rest and shifts smoothly onto laptop screen at max zoom
  const startBox = computeDeskViewBox(1440, 900, 0);
  const endBox = computeDeskViewBox(1440, 900, 1);
  assert.ok(Math.abs(startBox.x + startBox.width / 2 - DESK_SVG_METRICS.deskCenterX) < 0.01);
  assert.ok(Math.abs(endBox.x + endBox.width / 2 - DESK_SVG_METRICS.laptopCenterX) < 0.01);
  assert.ok(Math.abs(endBox.y + endBox.height / 2 - DESK_SVG_METRICS.laptopCenterY) < 0.01);
  assert.ok(endBox.width < startBox.width / 6);

  // Frame 1 (Arrival at sticky lock: progress = 0)
  const start = evaluateOtherWorldFrame(0, maxScale, false);
  assert.equal(start.textOpacity, 1);
  assert.equal(start.textSpreadPx, 0);
  assert.equal(start.cueOpacity, 1);
  assert.equal(start.deskScale, 1);
  assert.equal(start.deskOpacity, 1);
  assert.equal(start.hobbiesOpacity, 0);
  assert.equal(start.hobbiesInteractive, false);

  // Quarter zoom: text stays fixed with zero separate spread while softly fading
  const quarterZoom = evaluateOtherWorldFrame(0.18, maxScale, false);
  assert.equal(quarterZoom.textSpreadPx, 0);
  assert.ok(quarterZoom.textOpacity > 0.1 && quarterZoom.textOpacity < 0.8);

  // Halfway through zoom: text faded out while stamp keeps zooming at full opacity
  const afterTextFade = evaluateOtherWorldFrame(OTHER_WORLD_TIMELINE.textFadeEnd, maxScale, false);
  assert.equal(afterTextFade.textOpacity, 0);
  assert.equal(afterTextFade.textSpreadPx, 0);
  assert.equal(afterTextFade.cueOpacity, 0);
  assert.ok(afterTextFade.deskScale > 1.3 && afterTextFade.deskScale < maxScale);
  assert.equal(afterTextFade.deskOpacity, 1);
  assert.equal(afterTextFade.hobbiesOpacity, 0);

  // Fixed zoom locked at zoomEnd = 0.70 while stamp dissolves into hobbies
  const atFixedZoom = evaluateOtherWorldFrame(OTHER_WORLD_TIMELINE.zoomEnd, maxScale, false);
  const duringDissolve = evaluateOtherWorldFrame(0.84, maxScale, false);
  assert.equal(atFixedZoom.deskScale, maxScale);
  assert.equal(duringDissolve.deskScale, maxScale, 'Zoom must remain locked at fixed scale during fade-out');
  assert.ok(duringDissolve.deskOpacity > 0 && duringDissolve.deskOpacity < 1);
  assert.ok(duringDissolve.hobbiesOpacity > 0 && duringDissolve.hobbiesOpacity < 1);
  assert.equal(duringDissolve.hobbiesInteractive, true);

  // Complete reveal at progress = 1
  const end = evaluateOtherWorldFrame(1, maxScale, false);
  assert.equal(end.deskScale, maxScale);
  assert.equal(end.deskOpacity, 0);
  assert.equal(end.hobbiesOpacity, 1);
  assert.equal(end.hobbiesTranslateY, 0);
  assert.equal(end.hobbiesInteractive, true);

  // Runway progress helper clamps cleanly
  assert.equal(computeRunwayProgress(200, 3200, 900), 0);
  assert.equal(computeRunwayProgress(-1150, 3200, 900), 0.5);
  assert.equal(computeRunwayProgress(-2500, 3200, 900), 1);

  // Reduced motion bypasses pinning with full visibility
  const reduced = evaluateOtherWorldFrame(0.2, maxScale, true);
  assert.equal(reduced.deskScale, 1);
  assert.equal(reduced.hobbiesOpacity, 1);
  assert.equal(reduced.hobbiesInteractive, true);

  // Exact copy, 3 ordered stamps, and 3 hobby folders
  assert.equal(OTHER_WORLD_COPY.leftLine1, 'Welcome');
  assert.equal(OTHER_WORLD_COPY.rightLine1, 'to my');
  assert.equal(OTHER_WORLD_COPY.leftLine2, 'other');
  assert.equal(OTHER_WORLD_COPY.rightLine2, 'world');
  assert.equal(OTHER_WORLD_COPY.leftSubtitle, 'Off the screen,');
  assert.equal(OTHER_WORLD_COPY.rightSubtitle, 'still very much me');
  assert.equal(OTHER_WORLD_STAMPS.length, 3);
  assert.equal(HOBBY_FOLDERS.length, 3);
  assert.ok(HOBBY_FOLDERS.every((f) => f.cards.length === 3));

  // Sequential one-by-one stamp loop (0 -> 1 -> 2 -> 0 ...) across zoom, then holds at zoomEnd
  const step = OTHER_WORLD_TIMELINE.stampLoopStep;
  assert.equal(computeSequentialStampIndex(0, 3), 0);
  assert.equal(computeSequentialStampIndex(step * 1.1, 3), 1);
  assert.equal(computeSequentialStampIndex(step * 2.1, 3), 2);
  assert.equal(computeSequentialStampIndex(step * 3.1, 3), 0);
  assert.equal(
    computeSequentialStampIndex(0.9, 3),
    computeSequentialStampIndex(OTHER_WORLD_TIMELINE.zoomEnd, 3),
  );
});
