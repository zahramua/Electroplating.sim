import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Battery, RefreshCw, Info, FlaskConical, Microscope, Trophy, Plug, HelpCircle, ChevronRight, ChevronLeft, X, Globe } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Language = 'en' | 'ar';

const translations = {
  en: {
    title: "ELECTROPLATING LAB",
    subtitle: "Ag (Silver) → Cu (Copper)",
    electrodeStatus: "Electrode Status",
    silverAnode: "Silver Anode",
    copperRing: "Copper Ring",
    silverPlatedRing: "Silver Plated Ring",
    sourceOfIons: "Source of Ag⁺ ions",
    targetForPlating: "Target for plating",
    silverCoated: "silver coated",
    atomicView: "Atomic View",
    silverAnodeSurface: "Silver Anode Surface",
    cathodeSurface: "Cathode Surface",
    atomsTransfer: "Atoms transfer from the anode lattice to the cathode surface.",
    dcPower: "DC POWER",
    wireToAnode: "Wire to Anode",
    wireToCathode: "Wire to Cathode",
    circuitOpen: "Circuit Open",
    connectWiresFirst: "Connect the wires to the battery first!",
    anodeDepleted: "Anode Depleted",
    anodeDepletedDesc: "The silver anode has run out of material!",
    tooManyParticles: "Too Many Particles",
    tooManyParticlesDesc: "Maximum 5 particles allowed. Wait for some to complete.",
    stayInSolution: "Stay in Solution!",
    stayInSolutionDesc: "Ions can only move within the electrolyte solution.",
    waitForElectron: "Wait for Electron",
    waitForElectronDesc: "An electron must be at the cathode first!",
    electronAtBattery: "Electron at Battery",
    electronAtBatteryDesc: "Drag from -ve terminal to cathode!",
    platingSuccessful: "Plating Successful!",
    silverDeposited: "Silver deposited on cathode!",
    anodeConnected: "Anode Connected",
    wireAttachedAnode: "Wire attached to silver anode.",
    cathodeConnected: "Cathode Connected",
    wireAttachedCathode: "Wire attached to copper ring.",
    electroplatingComplete: "Electroplating Complete!",
    ringPlatedSuccess: "Copper ring has been successfully electroplated with silver!",
    summary: "Summary:",
    massConsumed: "Silver Anode mass consumed:",
    ringFullySilver: "Ring is now fully silver colored!",
    startNewExperiment: "Start New Experiment",
    howToPlay: "How to play:",
    step1: "Drag the Wires to connect Anode & Cathode to Battery.",
    step2: "Click Anode to release Ag⁺ Ion & Electron (e⁻).",
    step3: "Drag e⁻ along the wire to the Battery.",
    step4: "Drag e⁻ from Battery along wire to Copper Ring.",
    step5: "Drag Ag⁺ from solution to Copper Ring.",
    step6: "Watch the ring gradually turn silver!",
    previous: "Previous",
    next: "Next",
    startPlating: "Start Plating!",
    tutorial: {
      welcome: "Welcome to Electroplating Lab!",
      welcomeDesc: "Learn how silver electroplating works by simulating the process step by step. You'll plate a copper ring with silver!",
      step1Title: "Step 1: Connect the Circuit",
      step1Desc: "First, drag both wire handles to connect the anode (silver bar) and cathode (copper ring) to the battery. The circuit must be complete before plating can begin.",
      step2Title: "Step 2: Release Silver Ions",
      step2Desc: "Click on the silver anode (the bar on the left) to release a silver ion (Ag+) into the solution. This also releases an electron (e-) onto the wire.",
      step3Title: "Step 3: Move the Electron",
      step3Desc: "Drag the electron (e-) along the wire to the battery's positive (+) terminal. Electrons can only travel through wires, not through the solution!",
      step4Title: "Step 4: Electron to Cathode",
      step4Desc: "A new electron appears at the negative (-) terminal. Drag it along the wire down to the copper ring (cathode).",
      step5Title: "Step 5: Complete the Plating",
      step5Desc: "Now drag the silver ion (Ag+) through the solution to the copper ring. When the ion meets the electron, silver gets deposited on the ring!",
      readyTitle: "You're Ready!",
      readyDesc: "Repeat this process to fully plate the copper ring with silver. Watch the ring gradually turn from copper to silver color!"
    }
  },
  ar: {
    title: "مختبر الطلاء الكهربائي",
    subtitle: "الفضة (Ag) ← النحاس (Cu)",
    electrodeStatus: "حالة القطب",
    silverAnode: "أنود الفضة",
    copperRing: "حلقة النحاس",
    silverPlatedRing: "حلقة مطلية بالفضة",
    sourceOfIons: "مصدر أيونات Ag⁺",
    targetForPlating: "الهدف للطلاء",
    silverCoated: "مطلي بالفضة",
    atomicView: "العرض الذري",
    silverAnodeSurface: "سطح أنود الفضة",
    cathodeSurface: "سطح الكاثود",
    atomsTransfer: "تنتقل الذرات من شبكة الأنود إلى سطح الكاثود.",
    dcPower: "طاقة تيار مستمر",
    wireToAnode: "سلك للأنود",
    wireToCathode: "سلك للكاثود",
    circuitOpen: "الدائرة مفتوحة",
    connectWiresFirst: "قم بتوصيل الأسلاك بالبطارية أولاً!",
    anodeDepleted: "نفاد الأنود",
    anodeDepletedDesc: "نفدت مادة أنود الفضة!",
    tooManyParticles: "جسيمات كثيرة جداً",
    tooManyParticlesDesc: "الحد الأقصى 5 جسيمات. انتظر حتى تكتمل بعضها.",
    stayInSolution: "ابق في المحلول!",
    stayInSolutionDesc: "يمكن للأيونات التحرك فقط داخل محلول الإلكتروليت.",
    waitForElectron: "انتظر الإلكترون",
    waitForElectronDesc: "يجب أن يكون هناك إلكترون عند الكاثود أولاً!",
    electronAtBattery: "الإلكترون عند البطارية",
    electronAtBatteryDesc: "اسحب من القطب السالب إلى الكاثود!",
    platingSuccessful: "نجح الطلاء!",
    silverDeposited: "تم ترسيب الفضة على الكاثود!",
    anodeConnected: "تم توصيل الأنود",
    wireAttachedAnode: "تم توصيل السلك بأنود الفضة.",
    cathodeConnected: "تم توصيل الكاثود",
    wireAttachedCathode: "تم توصيل السلك بحلقة النحاس.",
    electroplatingComplete: "اكتمل الطلاء الكهربائي!",
    ringPlatedSuccess: "تم طلاء حلقة النحاس بالفضة بنجاح!",
    summary: "ملخص:",
    massConsumed: "كتلة الأنود المستهلكة:",
    ringFullySilver: "الحلقة الآن مطلية بالكامل بالفضة!",
    startNewExperiment: "ابدأ تجربة جديدة",
    howToPlay: "كيفية اللعب:",
    step1: "اسحب الأسلاك لتوصيل الأنود والكاثود بالبطارية.",
    step2: "انقر على الأنود لإطلاق أيون Ag⁺ وإلكترون (e⁻).",
    step3: "اسحب e⁻ على طول السلك إلى البطارية.",
    step4: "اسحب e⁻ من البطارية على طول السلك إلى حلقة النحاس.",
    step5: "اسحب Ag⁺ من المحلول إلى حلقة النحاس.",
    step6: "شاهد الحلقة تتحول تدريجياً إلى اللون الفضي!",
    previous: "السابق",
    next: "التالي",
    startPlating: "ابدأ الطلاء!",
    tutorial: {
      welcome: "مرحباً بك في مختبر الطلاء الكهربائي!",
      welcomeDesc: "تعلم كيف يعمل طلاء الفضة الكهربائي من خلال محاكاة العملية خطوة بخطوة. ستقوم بطلاء حلقة نحاسية بالفضة!",
      step1Title: "الخطوة 1: أكمل الدائرة",
      step1Desc: "أولاً، اسحب مقابض الأسلاك لتوصيل الأنود (قضيب الفضة) والكاثود (حلقة النحاس) بالبطارية. يجب أن تكتمل الدائرة قبل بدء الطلاء.",
      step2Title: "الخطوة 2: أطلق أيونات الفضة",
      step2Desc: "انقر على أنود الفضة (القضيب على اليسار) لإطلاق أيون فضة (Ag+) في المحلول. هذا يطلق أيضاً إلكتروناً (e-) على السلك.",
      step3Title: "الخطوة 3: حرك الإلكترون",
      step3Desc: "اسحب الإلكترون (e-) على طول السلك إلى القطب الموجب (+) للبطارية. يمكن للإلكترونات السفر فقط عبر الأسلاك، وليس عبر المحلول!",
      step4Title: "الخطوة 4: الإلكترون إلى الكاثود",
      step4Desc: "يظهر إلكترون جديد عند القطب السالب (-). اسحبه على طول السلك إلى حلقة النحاس (الكاثود).",
      step5Title: "الخطوة 5: أكمل الطلاء",
      step5Desc: "الآن اسحب أيون الفضة (Ag+) عبر المحلول إلى حلقة النحاس. عندما يلتقي الأيون بالإلكترون، يترسب الفضة على الحلقة!",
      readyTitle: "أنت جاهز!",
      readyDesc: "كرر هذه العملية لطلاء حلقة النحاس بالكامل بالفضة. شاهد الحلقة تتحول تدريجياً من اللون النحاسي إلى الفضي!"
    }
  }
};

const getTutorialSteps = (t: typeof translations.en) => [
  { title: t.tutorial.welcome, content: t.tutorial.welcomeDesc, highlight: null },
  { title: t.tutorial.step1Title, content: t.tutorial.step1Desc, highlight: "wires" },
  { title: t.tutorial.step2Title, content: t.tutorial.step2Desc, highlight: "anode" },
  { title: t.tutorial.step3Title, content: t.tutorial.step3Desc, highlight: "anode_wire" },
  { title: t.tutorial.step4Title, content: t.tutorial.step4Desc, highlight: "cathode_wire" },
  { title: t.tutorial.step5Title, content: t.tutorial.step5Desc, highlight: "cathode" },
  { title: t.tutorial.readyTitle, content: t.tutorial.readyDesc, highlight: null }
];

const useSoundEffects = () => {
  const audioContext = useRef<AudioContext | null>(null);

  const getContext = useCallback(() => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) => {
    const ctx = getContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }, [getContext]);

  const playSuccess = useCallback(() => {
    const ctx = getContext();
    const now = ctx.currentTime;
    
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.3);
    });
  }, [getContext]);

  const playError = useCallback(() => {
    playTone(200, 0.15, 'square', 0.2);
    setTimeout(() => playTone(150, 0.2, 'square', 0.2), 100);
  }, [playTone]);

  const playPlating = useCallback(() => {
    const ctx = getContext();
    const now = ctx.currentTime;
    
    [880, 1108.73, 1318.51].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.2);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.2);
    });
  }, [getContext]);

  const playWin = useCallback(() => {
    const ctx = getContext();
    const now = ctx.currentTime;
    
    const melody = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50];
    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.25, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.25);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.25);
    });
  }, [getContext]);

  const playConnect = useCallback(() => {
    playTone(440, 0.1, 'sine', 0.2);
    setTimeout(() => playTone(554.37, 0.15, 'sine', 0.2), 80);
  }, [playTone]);

  const playPop = useCallback(() => {
    playTone(600, 0.08, 'sine', 0.15);
  }, [playTone]);

  return { playSuccess, playError, playPlating, playWin, playConnect, playPop };
};

type ParticleType = 'ion' | 'anode_electron' | 'cathode_electron';
type ElectronSegment = 'anode_wire' | 'cathode_wire';

interface Particle {
  id: string;
  type: ParticleType;
  x: number;
  y: number;
  status: 'active' | 'waiting' | 'plated';
  segment?: ElectronSegment;
  progress?: number;
}

const ANODE_START_MASS = 50;
const CATHODE_START_MASS = 25;
const MASS_PER_UNIT = 5;
const TOTAL_PLATING_GOAL = 6;

const COPPER_COLOR = { r: 184, g: 115, b: 51 };
const SILVER_GRADIENT_START = '#f5f7fa';
const SILVER_GRADIENT_END = '#c3cfe2';

function getPointOnPath(points: { x: number; y: number }[], progress: number): { x: number; y: number } {
  if (progress <= 0) return points[0];
  if (progress >= 1) return points[points.length - 1];
  
  const totalSegments = points.length - 1;
  const segmentProgress = progress * totalSegments;
  const segmentIndex = Math.floor(segmentProgress);
  const localProgress = segmentProgress - segmentIndex;
  
  const startPoint = points[Math.min(segmentIndex, points.length - 1)];
  const endPoint = points[Math.min(segmentIndex + 1, points.length - 1)];
  
  return {
    x: startPoint.x + (endPoint.x - startPoint.x) * localProgress,
    y: startPoint.y + (endPoint.y - startPoint.y) * localProgress,
  };
}

function getProgressFromDrag(
  points: { x: number; y: number }[],
  dragX: number,
  dragY: number,
  currentProgress: number
): number {
  let minDist = Infinity;
  let bestProgress = currentProgress;
  
  for (let p = 0; p <= 1; p += 0.01) {
    const point = getPointOnPath(points, p);
    const dist = Math.sqrt((point.x - dragX) ** 2 + (point.y - dragY) ** 2);
    if (dist < minDist) {
      minDist = dist;
      bestProgress = p;
    }
  }
  
  return Math.max(currentProgress, bestProgress);
}

function createPathD(points: { x: number; y: number }[]): string {
  if (points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    d += ` L ${points[i].x} ${points[i].y}`;
  }
  return d;
}

export default function ElectroplatingGame() {
  const [anodeMass, setAnodeMass] = useState(ANODE_START_MASS);
  const [cathodeMass, setCathodeMass] = useState(CATHODE_START_MASS);
  const [ions, setIons] = useState<Particle[]>([]);
  const [electrons, setElectrons] = useState<Particle[]>([]);
  const [platedCount, setPlatedCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [isAnodeConnected, setIsAnodeConnected] = useState(false);
  const [isCathodeConnected, setIsCathodeConnected] = useState(false);

  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [currentDotProgress, setCurrentDotProgress] = useState(0);
  const [draggingElectronId, setDraggingElectronId] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('en');

  const t = translations[language];
  const tutorialSteps = getTutorialSteps(t);
  const isRTL = language === 'ar';

  const { toast } = useToast();
  const sounds = useSoundEffects();
  
  const isCircuitComplete = isAnodeConnected && isCathodeConnected;
  
  useEffect(() => {
    if (!isCircuitComplete) {
      setCurrentDotProgress(0);
      return;
    }
    
    const interval = setInterval(() => {
      setCurrentDotProgress(prev => {
        const next = prev + 0.01;
        return next > 1 ? 0 : next;
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [isCircuitComplete]);
  
  const cathodeRef = useRef<HTMLDivElement>(null);
  const beakerRef = useRef<HTMLDivElement>(null);
  const anodeRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const plusTerminalRef = useRef<HTMLDivElement>(null);
  const minusTerminalRef = useRef<HTMLDivElement>(null);
  const anodeConnectorRef = useRef<HTMLDivElement>(null);
  const cathodeConnectorRef = useRef<HTMLDivElement>(null);

  const [anodeWirePoints, setAnodeWirePoints] = useState<{ x: number; y: number }[]>([]);
  const [cathodeWirePoints, setCathodeWirePoints] = useState<{ x: number; y: number }[]>([]);

  const calculateWirePoints = useCallback(() => {
    if (!svgRef.current || !plusTerminalRef.current || !minusTerminalRef.current || 
        !anodeConnectorRef.current || !cathodeConnectorRef.current) return;

    const svgRect = svgRef.current.getBoundingClientRect();
    const viewBoxWidth = 1000;
    const viewBoxHeight = 600;

    const toSvgCoords = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      return {
        x: ((centerX - svgRect.left) / svgRect.width) * viewBoxWidth,
        y: ((centerY - svgRect.top) / svgRect.height) * viewBoxHeight
      };
    };

    const plusPos = toSvgCoords(plusTerminalRef.current);
    const minusPos = toSvgCoords(minusTerminalRef.current);
    const anodeConnPos = toSvgCoords(anodeConnectorRef.current);
    const cathodeConnPos = toSvgCoords(cathodeConnectorRef.current);

    const topY = Math.min(plusPos.y, minusPos.y) - 40;

    setAnodeWirePoints([
      { x: anodeConnPos.x, y: anodeConnPos.y },
      { x: anodeConnPos.x, y: topY },
      { x: plusPos.x, y: topY }
    ]);

    setCathodeWirePoints([
      { x: minusPos.x, y: topY },
      { x: cathodeConnPos.x, y: topY },
      { x: cathodeConnPos.x, y: cathodeConnPos.y }
    ]);
  }, []);

  useEffect(() => {
    calculateWirePoints();
    const handleResize = () => calculateWirePoints();
    window.addEventListener('resize', handleResize);
    const timer = setTimeout(calculateWirePoints, 100);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [calculateWirePoints, isAnodeConnected, isCathodeConnected]);

  const getRingColor = () => {
    const progress = platedCount / TOTAL_PLATING_GOAL;
    if (progress >= 1) {
      return SILVER_GRADIENT_END;
    }
    const silverRGB = { r: 195, g: 207, b: 226 };
    const r = Math.round(COPPER_COLOR.r + (silverRGB.r - COPPER_COLOR.r) * progress);
    const g = Math.round(COPPER_COLOR.g + (silverRGB.g - COPPER_COLOR.g) * progress);
    const b = Math.round(COPPER_COLOR.b + (silverRGB.b - COPPER_COLOR.b) * progress);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const getPlatingGradient = () => {
    const progress = platedCount / TOTAL_PLATING_GOAL;
    const silverPercent = Math.round(progress * 100);
    const copperColor = `rgb(${COPPER_COLOR.r}, ${COPPER_COLOR.g}, ${COPPER_COLOR.b})`;
    
    if (progress >= 1) {
      return `linear-gradient(135deg, ${SILVER_GRADIENT_START} 0%, ${SILVER_GRADIENT_END} 100%)`;
    }
    
    return `conic-gradient(from 0deg, ${SILVER_GRADIENT_END} 0deg, ${SILVER_GRADIENT_END} ${silverPercent * 3.6}deg, ${copperColor} ${silverPercent * 3.6}deg, ${copperColor} 360deg)`;
  };

  const spawnIon = () => {
    if (!isAnodeConnected || !isCathodeConnected) {
      sounds.playError();
      toast({
        title: t.circuitOpen,
        description: t.connectWiresFirst,
        variant: "destructive"
      });
      return;
    }

    if (anodeMass <= 10) {
      sounds.playError();
      toast({
        title: t.anodeDepleted,
        description: t.anodeDepletedDesc,
        variant: "destructive"
      });
      return;
    }

    const activeParticles = ions.filter(i => i.status === 'active').length + electrons.filter(e => e.status === 'active').length;
    if (activeParticles >= 5) {
      sounds.playError();
      toast({
        title: t.tooManyParticles,
        description: t.tooManyParticlesDesc,
        variant: "destructive",
        duration: 1500
      });
      return;
    }
    
    sounds.playPop();
    
    const newIon: Particle = {
      id: `ion-${Date.now()}`,
      type: 'ion',
      x: 0, 
      y: 0,
      status: 'active'
    };

    const startPoint = anodeWirePoints.length > 0 ? anodeWirePoints[0] : { x: 0, y: 0 };
    const newAnodeElectron: Particle = {
      id: `ae-${Date.now()}`,
      type: 'anode_electron',
      x: startPoint.x,
      y: startPoint.y,
      status: 'active',
      segment: 'anode_wire',
      progress: 0
    };
    
    setIons(prev => [...prev, newIon]);
    setElectrons(prev => [...prev, newAnodeElectron]);
    setAnodeMass(prev => prev - MASS_PER_UNIT);
  };

  const getElectrolyteBounds = useCallback(() => {
    const beaker = beakerRef.current?.getBoundingClientRect();
    if (!beaker) return null;
    return {
      left: beaker.left + 20,
      right: beaker.right - 20,
      top: beaker.top + 60,
      bottom: beaker.bottom - 20
    };
  }, []);

  const [ionResetKey, setIonResetKey] = useState(0);

  const handleIonDragEnd = (id: string, info: any) => {
    const cathodeRect = cathodeRef.current?.getBoundingClientRect();
    const electrolyteBounds = getElectrolyteBounds();
    const dropPoint = info.point;
    const hasWaitingElectron = electrons.some(e => e.status === 'waiting');

    if (electrolyteBounds && (
        dropPoint.x < electrolyteBounds.left ||
        dropPoint.x > electrolyteBounds.right ||
        dropPoint.y < electrolyteBounds.top ||
        dropPoint.y > electrolyteBounds.bottom
    )) {
      sounds.playError();
      toast({
        title: t.stayInSolution,
        description: t.stayInSolutionDesc,
        variant: "destructive",
        duration: 1500
      });
      setIonResetKey(prev => prev + 1);
      return;
    }

    if (cathodeRect && 
        dropPoint.x >= cathodeRect.left && 
        dropPoint.x <= cathodeRect.right && 
        dropPoint.y >= cathodeRect.top && 
        dropPoint.y <= cathodeRect.bottom &&
        hasWaitingElectron) {
      
      sounds.playSuccess();
      setIons(prev => prev.map(p => p.id === id ? { ...p, status: 'waiting' } : p));
    } else if (cathodeRect && 
        dropPoint.x >= cathodeRect.left && 
        dropPoint.x <= cathodeRect.right && 
        dropPoint.y >= cathodeRect.top && 
        dropPoint.y <= cathodeRect.bottom &&
        !hasWaitingElectron) {
      sounds.playError();
      toast({
        title: t.waitForElectron,
        description: t.waitForElectronDesc,
        variant: "destructive",
        duration: 1500
      });
    }
  };

  const handleElectronDrag = useCallback((id: string, info: any) => {
    const svgRect = svgRef.current?.getBoundingClientRect();
    if (!svgRect) return;
    
    const svgX = (info.point.x - svgRect.left) * (1000 / svgRect.width);
    const svgY = (info.point.y - svgRect.top) * (600 / svgRect.height);
    
    setElectrons(prev => prev.map(electron => {
      if (electron.id !== id) return electron;
      
      const points = electron.segment === 'anode_wire' ? anodeWirePoints : cathodeWirePoints;
      if (points.length === 0) return electron;
      
      const newProgress = getProgressFromDrag(points, svgX, svgY, electron.progress || 0);
      const newPos = getPointOnPath(points, newProgress);
      
      return {
        ...electron,
        x: newPos.x,
        y: newPos.y,
        progress: newProgress
      };
    }));
  }, [anodeWirePoints, cathodeWirePoints]);

  const handleElectronDragEnd = useCallback((id: string) => {
    setElectrons(prev => {
      const electron = prev.find(e => e.id === id);
      if (!electron) return prev;
      
      if (electron.segment === 'anode_wire' && (electron.progress || 0) >= 0.95) {
        const filtered = prev.filter(e => e.id !== id);
        const startPoint = cathodeWirePoints.length > 0 ? cathodeWirePoints[0] : { x: 0, y: 0 };
        const newCathodeElectron: Particle = {
          id: `ce-${Date.now()}`,
          type: 'cathode_electron',
          x: startPoint.x,
          y: startPoint.y,
          status: 'active',
          segment: 'cathode_wire',
          progress: 0
        };
        
        sounds.playSuccess();
        toast({
          title: t.electronAtBattery,
          description: t.electronAtBatteryDesc,
          duration: 1500,
          className: "bg-yellow-500/10 border-yellow-500/30 text-yellow-200 h-12"
        });
        
        return [...filtered, newCathodeElectron];
      }
      
      if (electron.segment === 'cathode_wire' && (electron.progress || 0) >= 0.95) {
        sounds.playSuccess();
        return prev.map(e => 
          e.id === id ? { ...e, status: 'waiting' as const, progress: 1 } : e
        );
      }
      
      return prev;
    });
  }, [toast, cathodeWirePoints, sounds]);

  useEffect(() => {
    const waitingIons = ions.filter(i => i.status === 'waiting');
    const waitingElectrons = electrons.filter(e => e.status === 'waiting');

    if (waitingIons.length > 0 && waitingElectrons.length > 0) {
      const pairs = Math.min(waitingIons.length, waitingElectrons.length);
      
      if (pairs > 0) {
        const usedIonIds = waitingIons.slice(0, pairs).map(i => i.id);
        const usedElectronIds = waitingElectrons.slice(0, pairs).map(e => e.id);

        setIons(prev => prev.filter(p => !usedIonIds.includes(p.id)));
        setElectrons(prev => prev.filter(p => !usedElectronIds.includes(p.id)));
        
        setCathodeMass(prev => prev + (MASS_PER_UNIT * pairs));
        
        sounds.playPlating();
        
        setPlatedCount(prev => {
          const newCount = prev + pairs;
          if (newCount >= TOTAL_PLATING_GOAL) {
            setTimeout(() => sounds.playWin(), 300);
            setShowSuccess(true);
          }
          return newCount;
        });
        
        toast({
          title: t.platingSuccessful,
          description: t.silverDeposited,
          duration: 1500,
          className: "bg-green-500/20 border-green-500/50 text-green-100"
        });
      }
    }
  }, [ions, electrons, toast, sounds, t]);

  const resetGame = () => {
    setAnodeMass(ANODE_START_MASS);
    setCathodeMass(CATHODE_START_MASS);
    setIons([]);
    setElectrons([]);
    setPlatedCount(0);
    setShowSuccess(false);
    setIsAnodeConnected(false);
    setIsCathodeConnected(false);
    setShowTutorial(true);
    setTutorialStep(0);
  };
  
  const getCurrentDotPosition = useCallback(() => {
    if (!isCircuitComplete) return null;
    
    const totalAnodeLength = anodeWirePoints.length > 1 ? anodeWirePoints.length - 1 : 0;
    const totalCathodeLength = cathodeWirePoints.length > 1 ? cathodeWirePoints.length - 1 : 0;
    const totalLength = totalAnodeLength + totalCathodeLength;
    
    if (totalLength === 0) return null;
    
    const anodeRatio = totalAnodeLength / totalLength;
    
    if (currentDotProgress <= anodeRatio) {
      const anodeProgress = currentDotProgress / anodeRatio;
      return getPointOnPath(anodeWirePoints, anodeProgress);
    } else {
      const cathodeProgress = (currentDotProgress - anodeRatio) / (1 - anodeRatio);
      return getPointOnPath(cathodeWirePoints, cathodeProgress);
    }
  }, [isCircuitComplete, anodeWirePoints, cathodeWirePoints, currentDotProgress]);

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 p-4 md:p-8 font-sans overflow-hidden flex flex-col items-center" dir={isRTL ? 'rtl' : 'ltr'}>
      
      <header className="w-full max-w-6xl flex justify-between items-center mb-8 z-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-wider text-slate-900">
            {t.title}
          </h1>
          <p className="text-slate-600 text-sm mt-1 flex items-center gap-2">
            <FlaskConical size={14} /> {t.subtitle}
          </p>
        </div>
        
        <div className="flex gap-3 items-center">
          <Select value={language} onValueChange={(val: Language) => setLanguage(val)}>
            <SelectTrigger className="w-[130px] bg-slate-100 border-slate-300">
              <Globe size={16} className="mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ar">العربية</SelectItem>
            </SelectContent>
          </Select>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full bg-slate-100 border-slate-300 hover:bg-slate-200">
                  <Info size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-slate-900 border-slate-700 text-slate-100 p-4">
                <p className="mb-2 font-semibold">{t.howToPlay}</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>{t.step1}</li>
                  <li>{t.step2}</li>
                  <li>{t.step3}</li>
                  <li>{t.step4}</li>
                  <li>{t.step5}</li>
                  <li>{t.step6}</li>
                </ol>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button variant="outline" size="icon" onClick={() => { setShowTutorial(true); setTutorialStep(0); }} className="rounded-full bg-slate-100 border-slate-300 hover:bg-slate-200">
            <HelpCircle size={18} />
          </Button>
          
          <Button variant="outline" size="icon" onClick={resetGame} className="rounded-full bg-slate-100 border-slate-300 hover:bg-slate-200">
            <RefreshCw size={18} />
          </Button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-4 gap-6 items-start relative">
        
        <div className="lg:col-span-1 flex flex-col gap-6 order-2 lg:order-1">
          
          <Card className="bg-slate-50 border-slate-200 p-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">{t.electrodeStatus}</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gradient-to-br from-gray-100 to-gray-400"/> {t.silverAnode}</span>
                    <span className="font-mono">{anodeMass}g</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-gray-400 to-gray-600"
                      initial={{ width: '100%' }}
                      animate={{ width: `${(anodeMass / ANODE_START_MASS) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-600">{t.sourceOfIons}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <motion.div 
                        className="w-3 h-3 rounded-full"
                        animate={{ backgroundColor: getRingColor() }}
                      />
                      {t.copperRing}
                    </span>
                    <span className="font-mono">{cathodeMass}g</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full"
                      style={{ background: `linear-gradient(to right, ${getRingColor()}, ${getRingColor()})` }}
                      initial={{ width: '50%' }}
                      animate={{ width: `${(cathodeMass / (CATHODE_START_MASS + ANODE_START_MASS)) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-600">{t.targetForPlating} ({Math.round((platedCount / TOTAL_PLATING_GOAL) * 100)}% {t.silverCoated})</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-50 border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-3 text-slate-700">
              <Microscope size={16} />
              <h3 className="text-sm font-semibold uppercase tracking-wider">{t.atomicView}</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-100 p-3 rounded-md border border-slate-300">
                <div className="text-[10px] text-center mb-2 text-slate-600">{t.silverAnodeSurface}</div>
                <div className="grid grid-cols-4 gap-1">
                  {Array.from({ length: 16 }).map((_, i) => {
                    const isGone = i >= Math.ceil((anodeMass / ANODE_START_MASS) * 16);
                    return (
                      <motion.div 
                        key={i}
                        className={`w-3 h-3 rounded-full ${isGone ? 'bg-slate-800/30' : 'bg-gradient-to-br from-gray-200 to-gray-400'}`}
                        animate={{ scale: isGone ? 0.5 : 1, opacity: isGone ? 0.2 : 1 }}
                      />
                    )
                  })}
                </div>
              </div>

              <div className="bg-slate-100 p-3 rounded-md border border-slate-300">
                <div className="text-[10px] text-center mb-2 text-slate-600">{t.cathodeSurface}</div>
                <div className="grid grid-cols-4 gap-1">
                  {Array.from({ length: 16 }).map((_, i) => {
                    const isPlated = i < Math.min(16, Math.floor(platedCount * 2.7));
                    return (
                      <div key={i} className="relative w-3 h-3">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 to-orange-700 opacity-80" />
                        
                        {isPlated && (
                          <motion.div 
                            className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-100 to-white shadow-sm z-10"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="mt-3 text-[10px] text-slate-600 text-center leading-tight">
              {t.atomsTransfer}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3 relative h-[600px] flex flex-col items-center justify-start order-1 lg:order-2 select-none">
          
          <svg 
            ref={svgRef}
            className="absolute inset-0 w-full h-full" 
            viewBox="0 0 1000 600" 
            preserveAspectRatio="xMidYMid meet"
            style={{ zIndex: 5 }}
          >
            {/* Anode wire path - only show wire, no animation unless both connected */}
            {isAnodeConnected && anodeWirePoints.length > 0 && (
              <path 
                d={createPathD(anodeWirePoints)}
                fill="none" 
                stroke="#444444" 
                strokeWidth="10" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            
            {/* Cathode wire path - only show wire, no animation unless both connected */}
            {isCathodeConnected && cathodeWirePoints.length > 0 && (
              <path 
                d={createPathD(cathodeWirePoints)}
                fill="none" 
                stroke="#444444" 
                strokeWidth="10" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            
            {/* Single moving current dot - only shown when both wires connected */}
            {isCircuitComplete && (() => {
              const dotPos = getCurrentDotPosition();
              if (!dotPos) return null;
              return (
                <circle
                  cx={dotPos.x}
                  cy={dotPos.y}
                  r="8"
                  fill="#FACC15"
                  stroke="#EAB308"
                  strokeWidth="2"
                  style={{ 
                    filter: 'drop-shadow(0 0 6px rgba(250, 204, 21, 0.9))'
                  }}
                />
              );
            })()}
          </svg>

          {/* Battery at top center */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 bg-slate-100 p-3 rounded-lg border-2 border-slate-400 shadow-lg">
            <div className="flex items-center gap-3 px-3">
              <div className="flex flex-col items-center">
                <span className="text-red-600 font-bold text-base">+</span>
                <div ref={plusTerminalRef} className="w-3 h-3 rounded-full bg-red-500 mt-0.5 border border-red-600"></div>
              </div>
              <Battery className="text-slate-800 w-10 h-10 rotate-90" />
              <div className="flex flex-col items-center">
                <span className="text-blue-600 font-bold text-base">-</span>
                <div ref={minusTerminalRef} className="w-3 h-3 rounded-full bg-blue-500 mt-0.5 border border-blue-600"></div>
              </div>
            </div>
            <div className="text-[9px] font-mono text-slate-600 text-center">{t.dcPower}</div>
          </div>

          {/* Wire handles */}
          {!isAnodeConnected && (
            <motion.div 
              drag
              dragMomentum={false}
              onDragEnd={(e, info) => {
                const anodeRect = anodeRef.current?.getBoundingClientRect();
                if (anodeRect && 
                    info.point.x >= anodeRect.left - 50 && 
                    info.point.x <= anodeRect.right + 50 && 
                    info.point.y >= anodeRect.top - 50 && 
                    info.point.y <= anodeRect.bottom + 50) {
                  setIsAnodeConnected(true);
                  sounds.playConnect();
                  toast({ title: t.anodeConnected, description: t.wireAttachedAnode });
                }
              }}
              className="absolute top-24 left-[20%] z-50 cursor-grab active:cursor-grabbing"
              whileHover={{ scale: 1.1 }}
            >
              <div className="flex items-center gap-2 bg-slate-600 px-3 py-1 rounded-full border border-slate-500 shadow-lg text-white text-xs">
                <Plug size={12} /> {t.wireToAnode}
              </div>
            </motion.div>
          )}

          {!isCathodeConnected && (
            <motion.div 
              drag
              dragMomentum={false}
              onDragEnd={(e, info) => {
                const cathodeRect = cathodeRef.current?.getBoundingClientRect();
                if (cathodeRect && 
                    info.point.x >= cathodeRect.left - 50 && 
                    info.point.x <= cathodeRect.right + 50 && 
                    info.point.y >= cathodeRect.top - 50 && 
                    info.point.y <= cathodeRect.bottom + 50) {
                  setIsCathodeConnected(true);
                  sounds.playConnect();
                  toast({ title: t.cathodeConnected, description: t.wireAttachedCathode });
                }
              }}
              className="absolute top-24 right-[20%] z-50 cursor-grab active:cursor-grabbing"
              whileHover={{ scale: 1.1 }}
            >
              <div className="flex items-center gap-2 bg-slate-600 px-3 py-1 rounded-full border border-slate-500 shadow-lg text-white text-xs">
                <Plug size={12} /> {t.wireToCathode}
              </div>
            </motion.div>
          )}

          {/* Beaker */}
          <div ref={beakerRef} className="relative w-full max-w-2xl h-80 mt-32">
            <div className="absolute inset-0 border-4 border-slate-400 border-t-0 rounded-b-3xl bg-blue-50 backdrop-blur-sm overflow-hidden">
              <div className="absolute bottom-0 left-0 right-0 h-[80%] liquid-surface animate-pulse opacity-40 bg-blue-100">
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              </div>
            </div>

            {/* Electrodes */}
            <div className="absolute inset-0 flex justify-between px-16 pt-6">
              
              {/* Anode */}
              <div className="relative group flex flex-col items-center" ref={anodeRef}>
                <div ref={anodeConnectorRef} className={`absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gray-600 border-2 border-gray-500 z-20 ${isAnodeConnected ? '' : 'opacity-0'}`}></div>
                
                <motion.div 
                  className="relative w-14 metallic-silver rounded-sm shadow-lg cursor-pointer border border-white/20 z-10 overflow-hidden"
                  style={{ height: 200 }} 
                  animate={{ 
                    width: 56 * (anodeMass / ANODE_START_MASS),
                  }} 
                  onClick={spawnIon}
                >
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                    <span className="text-xs font-bold text-white text-center">Click</span>
                  </div>
                </motion.div>
                <div className="text-center mt-2 text-xs font-bold text-slate-500">{t.silverAnode}</div>
              </div>

              {/* Cathode */}
              <div className="relative flex flex-col items-center" ref={cathodeRef}>
                <div ref={cathodeConnectorRef} className={`absolute top-6 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gray-600 border-2 border-gray-500 z-20 ${isCathodeConnected ? '' : 'opacity-0'}`}></div>
                
                <motion.div 
                  className="relative w-20 h-20 rounded-full shadow-lg z-10 flex items-center justify-center overflow-hidden"
                  style={{ 
                    marginTop: 40,
                    background: getPlatingGradient(),
                  }}
                >
                  <div className="w-12 h-12 rounded-full relative z-10 pointer-events-none" style={{ backgroundColor: 'rgb(219, 234, 254)' }} />
                </motion.div>

                <div className="text-center mt-6 text-xs font-bold" style={{ color: getRingColor() }}>
                  {platedCount >= TOTAL_PLATING_GOAL ? t.silverPlatedRing : t.copperRing}
                </div>
              </div>
            </div>

            {/* Ions */}
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 30 }}>
              <AnimatePresence>
                {ions.map((ion) => ion.status === 'active' && (
                  <motion.div
                    key={`${ion.id}-${ionResetKey}`}
                    initial={{ x: 70, y: 100, opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      y: [100, 110, 90, 100] 
                    }} 
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ 
                      y: { repeat: Infinity, duration: 4, ease: "easeInOut" } 
                    }}
                    drag={true} 
                    dragConstraints={beakerRef}
                    dragElastic={0.1}
                    dragMomentum={false}
                    onDragEnd={(e, info) => handleIonDragEnd(ion.id, info)}
                    className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-300 border border-slate-400 shadow-[0_0_8px_rgba(255,255,255,0.5)] flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing"
                    style={{ touchAction: 'none' }}
                  >
                    <div className="text-[10px] font-bold text-slate-700 select-none flex flex-col items-center leading-none">
                      <span>Ag</span>
                      <span className="text-[7px] absolute top-0.5 right-0.5">+</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Electrons on wire - strictly constrained to wire path */}
          <svg 
            className="absolute inset-0 w-full h-full" 
            viewBox="0 0 1000 600" 
            preserveAspectRatio="xMidYMid meet"
            style={{ zIndex: 40, pointerEvents: 'auto' }}
            onMouseMove={(e) => {
              if (!draggingElectronId) return;
              
              const currentSvg = e.currentTarget.getBoundingClientRect();
              const svgX = (e.clientX - currentSvg.left) * (1000 / currentSvg.width);
              const svgY = (e.clientY - currentSvg.top) * (600 / currentSvg.height);
              
              const electron = electrons.find(el => el.id === draggingElectronId);
              if (!electron) return;
              
              const points = electron.segment === 'anode_wire' ? anodeWirePoints : cathodeWirePoints;
              if (points.length > 0) {
                const newProgress = getProgressFromDrag(points, svgX, svgY, electron.progress || 0);
                const newPos = getPointOnPath(points, newProgress);
                setElectrons(prev => prev.map(el => 
                  el.id === draggingElectronId ? { ...el, x: newPos.x, y: newPos.y, progress: newProgress } : el
                ));
              }
            }}
            onMouseUp={() => {
              if (draggingElectronId) {
                handleElectronDragEnd(draggingElectronId);
                setDraggingElectronId(null);
              }
            }}
            onMouseLeave={() => {
              if (draggingElectronId) {
                setDraggingElectronId(null);
              }
            }}
            onTouchMove={(e) => {
              if (!draggingElectronId || e.touches.length === 0) return;
              
              const touch = e.touches[0];
              const currentSvg = e.currentTarget.getBoundingClientRect();
              const svgX = (touch.clientX - currentSvg.left) * (1000 / currentSvg.width);
              const svgY = (touch.clientY - currentSvg.top) * (600 / currentSvg.height);
              
              const electron = electrons.find(el => el.id === draggingElectronId);
              if (!electron) return;
              
              const points = electron.segment === 'anode_wire' ? anodeWirePoints : cathodeWirePoints;
              if (points.length > 0) {
                const newProgress = getProgressFromDrag(points, svgX, svgY, electron.progress || 0);
                const newPos = getPointOnPath(points, newProgress);
                setElectrons(prev => prev.map(el => 
                  el.id === draggingElectronId ? { ...el, x: newPos.x, y: newPos.y, progress: newProgress } : el
                ));
              }
            }}
            onTouchEnd={() => {
              if (draggingElectronId) {
                handleElectronDragEnd(draggingElectronId);
                setDraggingElectronId(null);
              }
            }}
          >
            <AnimatePresence>
              {electrons.filter(e => e.status === 'active').map((electron) => (
                <g
                  key={electron.id}
                  transform={`translate(${electron.x}, ${electron.y})`}
                  style={{ cursor: draggingElectronId === electron.id ? 'grabbing' : 'grab', pointerEvents: 'auto' }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDraggingElectronId(electron.id);
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    setDraggingElectronId(electron.id);
                  }}
                >
                  <circle
                    cx={0}
                    cy={0}
                    r="18"
                    fill="#FACC15"
                    stroke="#EAB308"
                    strokeWidth="3"
                    style={{ 
                      filter: 'drop-shadow(0 0 8px rgba(253, 224, 71, 0.9))'
                    }}
                  />
                  <text
                    x={0}
                    y={5}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="bold"
                    fill="#854D0E"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    e⁻
                  </text>
                </g>
              ))}
            </AnimatePresence>
          </svg>
        </div>
      </main>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="bg-slate-900 border-slate-700 text-slate-100" dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-400 text-2xl">
              <Trophy size={24} /> {t.electroplatingComplete}
            </DialogTitle>
            <DialogDescription className="text-slate-400 pt-2 text-lg">
              {t.ringPlatedSuccess}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-sm">
              <p className="mb-2"><strong>{t.summary}</strong></p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>{t.massConsumed} {ANODE_START_MASS - anodeMass}g</li>
                <li>{t.ringFullySilver}</li>
              </ul>
            </div>
            <Button onClick={resetGame} className="w-full bg-primary hover:bg-primary/90 text-white font-bold">
              {t.startNewExperiment}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
        <DialogContent className="bg-white border-slate-200 text-slate-900 max-w-lg" dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-800 text-xl">
              <HelpCircle size={22} className="text-blue-500" /> {tutorialSteps[tutorialStep].title}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Tutorial step {tutorialStep + 1} of {tutorialSteps.length}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-slate-600 leading-relaxed">
              {tutorialSteps[tutorialStep].content}
            </p>
            
            <div className="flex items-center justify-center gap-1 mt-6 mb-4">
              {tutorialSteps.map((_, index) => (
                <div 
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === tutorialStep ? 'bg-blue-500' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex justify-between gap-3">
              <Button 
                variant="outline" 
                onClick={() => setTutorialStep(prev => Math.max(0, prev - 1))}
                disabled={tutorialStep === 0}
                className="flex items-center gap-1"
              >
                {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />} {t.previous}
              </Button>
              
              {tutorialStep < tutorialSteps.length - 1 ? (
                <Button 
                  onClick={() => setTutorialStep(prev => prev + 1)}
                  className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {t.next} {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </Button>
              ) : (
                <Button 
                  onClick={() => setShowTutorial(false)}
                  className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white"
                >
                  {t.startPlating}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
