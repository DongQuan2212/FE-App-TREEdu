/**
 * TreeProgressCard.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Requires:
 *   npx expo install react-native-svg react-native-reanimated
 *
 * Usage (unchanged from your original):
 *   <TreeProgressCard tree={tree} onWater={waterTree} />
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    ActivityIndicator, Platform, Dimensions,
} from 'react-native';
import Svg, {
    Defs, RadialGradient, LinearGradient, Stop,
    Ellipse, Rect, Circle, Line, Path, G,
} from 'react-native-svg';
import Animated, {
    useSharedValue, useAnimatedStyle, useAnimatedProps,
    withRepeat, withSequence, withTiming, withDelay,
    Easing, cancelAnimation,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { TreeData } from '@/src/hooks/useMyTree';

// ── Animated wrappers ──────────────────────────────────────────────────────────
const AnimatedG   = Animated.createAnimatedComponent(G);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

// ── Constants ──────────────────────────────────────────────────────────────────
const { width: SCREEN_W } = Dimensions.get('window');
const SVG_W = Math.min(SCREEN_W - 32, 360);  // card padding = 16 each side
const SVG_H = 230;
const CX    = SVG_W / 2;   // horizontal center

// Per-stage canopy info (used by bird orbit)
const STAGE_CANOPY: Record<string, { cy: number; rx: number }> = {
    SEED:    { cy: 190, rx: 0  },
    SPROUT:  { cy: 165, rx: 22 },
    YOUNG:   { cy: 148, rx: 36 },
    GROWING: { cy: 130, rx: 54 },
    FLOWER:  { cy: 118, rx: 68 },
    FRUIT:   { cy: 112, rx: 75 },
    ANCIENT: { cy: 100, rx: 90 },
};

// Sky color per stage  [top, mid]
const STAGE_SKY: Record<string, [string, string]> = {
    SEED:    ['#0a1628', '#0d2318'],
    SPROUT:  ['#0a1e2a', '#0d2a1e'],
    YOUNG:   ['#081c14', '#0d2318'],
    GROWING: ['#071810', '#0a2014'],
    FLOWER:  ['#1a0a28', '#1a0d2a'],
    FRUIT:   ['#0f1a0d', '#1a2e0a'],
    ANCIENT: ['#0d0a1e', '#1a0d2e'],
};

// ── Health helper ──────────────────────────────────────────────────────────────
const healthCfg = (h: number) => {
    if (h > 60) return { color: '#4ade80', label: 'Khỏe mạnh',   barFrom: '#166534', barTo: '#4ade80' };
    if (h > 30) return { color: '#fbbf24', label: 'Cần chăm sóc', barFrom: '#92400e', barTo: '#fbbf24' };
    return             { color: '#f87171', label: 'Nguy hiểm!',   barFrom: '#7f1d1d', barTo: '#f87171' };
};

// ── SVG Tree shapes ────────────────────────────────────────────────────────────
// All trees are drawn inside a 260×220 viewBox, centered at (130, _)
// so they scale proportionally with the card width.

function TrunkGrad({ id }: { id: string }) {
    return (
        <LinearGradient id={id} x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0"   stopColor="#5c3317" />
            <Stop offset="0.5" stopColor="#7c4a22" />
            <Stop offset="1"   stopColor="#5c3317" />
        </LinearGradient>
    );
}

function TreeSeed() {
    return (
        <G>
            <Rect x="121" y="175" width="18" height="28" rx="6" fill="url(#trunk)" />
            <Ellipse cx="130" cy="168" rx="20" ry="16" fill="#166534" />
            <Ellipse cx="130" cy="162" rx="14" ry="11" fill="#16a34a" />
            <Ellipse cx="130" cy="157" rx="9"  ry="7"  fill="#22c55e" />
        </G>
    );
}
function TreeSprout() {
    return (
        <G>
            <Rect x="118" y="162" width="24" height="42" rx="8" fill="url(#trunk)" />
            <Ellipse cx="130" cy="150" rx="32" ry="26" fill="#15803d" />
            <Ellipse cx="118" cy="144" rx="22" ry="17" fill="#16a34a" />
            <Ellipse cx="142" cy="143" rx="22" ry="17" fill="#16a34a" />
            <Ellipse cx="130" cy="138" rx="20" ry="15" fill="#22c55e" />
        </G>
    );
}
function TreeYoung() {
    return (
        <G>
            <Rect x="116" y="152" width="28" height="52" rx="9" fill="url(#trunk)" />
            <Ellipse cx="130" cy="135" rx="44" ry="34" fill="#15803d" />
            <Ellipse cx="110" cy="130" rx="28" ry="22" fill="#16a34a" />
            <Ellipse cx="150" cy="129" rx="28" ry="22" fill="#16a34a" />
            <Ellipse cx="130" cy="122" rx="30" ry="23" fill="#22c55e" />
            <Ellipse cx="130" cy="114" rx="20" ry="16" fill="#4ade80" />
        </G>
    );
}
function TreeGrowing() {
    return (
        <G>
            <Rect x="114" y="145" width="32" height="62" rx="10" fill="url(#trunk)" />
            <Line x1="120" y1="158" x2="74"  y2="130" stroke="#7c4a22" strokeWidth="11" strokeLinecap="round" />
            <Line x1="140" y1="163" x2="186" y2="135" stroke="#7c4a22" strokeWidth="10" strokeLinecap="round" />
            <Ellipse cx="130" cy="112" rx="60" ry="46" fill="#14532d" />
            <Ellipse cx="80"  cy="136" rx="36" ry="28" fill="#15803d" />
            <Ellipse cx="180" cy="134" rx="36" ry="28" fill="#15803d" />
            <Ellipse cx="108" cy="98"  rx="36" ry="28" fill="#16a34a" />
            <Ellipse cx="152" cy="96"  rx="36" ry="28" fill="#16a34a" />
            <Ellipse cx="130" cy="86"  rx="30" ry="24" fill="#22c55e" />
            <Ellipse cx="130" cy="78"  rx="20" ry="16" fill="#4ade80" />
            {/* flowers */}
            <Circle cx="92"  cy="128" r="5" fill="#f9a8d4" />
            <Circle cx="168" cy="126" r="5" fill="#f9a8d4" />
        </G>
    );
}
function TreeFlower() {
    return (
        <G>
            <Rect x="114" y="140" width="32" height="68" rx="10" fill="url(#trunk)" />
            <Line x1="120" y1="154" x2="70"  y2="122" stroke="#7c4a22" strokeWidth="12" strokeLinecap="round" />
            <Line x1="140" y1="160" x2="190" y2="128" stroke="#7c4a22" strokeWidth="11" strokeLinecap="round" />
            <Ellipse cx="130" cy="104" rx="66" ry="52" fill="#14532d" />
            <Ellipse cx="72"  cy="130" rx="42" ry="33" fill="#15803d" />
            <Ellipse cx="188" cy="128" rx="42" ry="33" fill="#15803d" />
            <Ellipse cx="104" cy="90"  rx="42" ry="33" fill="#16a34a" />
            <Ellipse cx="156" cy="88"  rx="42" ry="33" fill="#16a34a" />
            <Ellipse cx="130" cy="78"  rx="34" ry="27" fill="#22c55e" />
            <Ellipse cx="114" cy="62"  rx="26" ry="20" fill="#4ade80" />
            <Ellipse cx="146" cy="60"  rx="26" ry="20" fill="#4ade80" />
            {/* many flowers */}
            <Circle cx="80"  cy="122" r="7" fill="#f9a8d4" /><Circle cx="80"  cy="116" r="2.5" fill="#15803d" />
            <Circle cx="180" cy="120" r="7" fill="#fda4af" /><Circle cx="180" cy="114" r="2.5" fill="#15803d" />
            <Circle cx="104" cy="84"  r="6" fill="#f9a8d4" /><Circle cx="104" cy="79"  r="2"   fill="#15803d" />
            <Circle cx="156" cy="82"  r="6" fill="#fda4af" /><Circle cx="156" cy="77"  r="2"   fill="#15803d" />
            <Circle cx="120" cy="58"  r="5" fill="#f9a8d4" />
            <Circle cx="140" cy="56"  r="5" fill="#fda4af" />
            <Circle cx="130" cy="50"  r="5" fill="#f9a8d4" />
            <Circle cx="65"  cy="136" r="5" fill="#f9a8d4" />
            <Circle cx="195" cy="134" r="5" fill="#fda4af" />
        </G>
    );
}
function TreeFruit() {
    return (
        <G>
            <Rect x="114" y="138" width="32" height="70" rx="10" fill="url(#trunk)" />
            <Line x1="120" y1="152" x2="68"  y2="118" stroke="#7c4a22" strokeWidth="12" strokeLinecap="round" />
            <Line x1="140" y1="158" x2="192" y2="124" stroke="#7c4a22" strokeWidth="11" strokeLinecap="round" />
            <Ellipse cx="130" cy="100" rx="70" ry="54" fill="#14532d" />
            <Ellipse cx="68"  cy="128" rx="44" ry="34" fill="#15803d" />
            <Ellipse cx="192" cy="126" rx="44" ry="34" fill="#15803d" />
            <Ellipse cx="100" cy="86"  rx="44" ry="34" fill="#16a34a" />
            <Ellipse cx="160" cy="84"  rx="44" ry="34" fill="#16a34a" />
            <Ellipse cx="130" cy="74"  rx="36" ry="28" fill="#22c55e" />
            <Ellipse cx="112" cy="58"  rx="28" ry="22" fill="#4ade80" />
            <Ellipse cx="148" cy="56"  rx="28" ry="22" fill="#4ade80" />
            {/* fruits */}
            <Circle cx="80"  cy="120" r="8" fill="#dc2626" /><Circle cx="80"  cy="114" r="3" fill="#15803d" />
            <Circle cx="180" cy="118" r="8" fill="#dc2626" /><Circle cx="180" cy="112" r="3" fill="#15803d" />
            <Circle cx="104" cy="80"  r="7" fill="#f97316" /><Circle cx="104" cy="74"  r="2.5" fill="#15803d" />
            <Circle cx="156" cy="78"  r="7" fill="#dc2626" /><Circle cx="156" cy="72"  r="2.5" fill="#15803d" />
            <Circle cx="64"  cy="134" r="6" fill="#f97316" /><Circle cx="64"  cy="129" r="2"   fill="#15803d" />
            <Circle cx="196" cy="132" r="6" fill="#dc2626" /><Circle cx="196" cy="127" r="2"   fill="#15803d" />
            <Circle cx="118" cy="54"  r="5" fill="#f9a8d4" />
            <Circle cx="142" cy="52"  r="5" fill="#fda4af" />
            <Circle cx="130" cy="45"  r="4" fill="#f9a8d4" />
        </G>
    );
}
function TreeAncient() {
    return (
        <G>
            <Rect x="113" y="135" width="34" height="73" rx="10" fill="url(#trunk)" />
            <Line x1="118" y1="152" x2="56"  y2="108" stroke="#7c4a22" strokeWidth="13" strokeLinecap="round" />
            <Line x1="142" y1="158" x2="204" y2="114" stroke="#7c4a22" strokeWidth="12" strokeLinecap="round" />
            <Line x1="115" y1="172" x2="44"  y2="136" stroke="#5c3317" strokeWidth="9"  strokeLinecap="round" />
            <Line x1="145" y1="178" x2="216" y2="143" stroke="#5c3317" strokeWidth="9"  strokeLinecap="round" />
            <Line x1="113" y1="190" x2="36"  y2="160" stroke="#4a2810" strokeWidth="6"  strokeLinecap="round" />
            <Line x1="147" y1="196" x2="224" y2="166" stroke="#4a2810" strokeWidth="6"  strokeLinecap="round" />
            <Ellipse cx="130" cy="97"  rx="80" ry="62" fill="#14532d" />
            <Ellipse cx="60"  cy="126" rx="48" ry="37" fill="#15803d" />
            <Ellipse cx="200" cy="124" rx="48" ry="37" fill="#15803d" />
            <Ellipse cx="96"  cy="76"  rx="46" ry="36" fill="#15803d" />
            <Ellipse cx="164" cy="74"  rx="46" ry="36" fill="#15803d" />
            <Ellipse cx="130" cy="64"  rx="38" ry="30" fill="#16a34a" />
            <Ellipse cx="108" cy="48"  rx="30" ry="23" fill="#22c55e" />
            <Ellipse cx="152" cy="46"  rx="30" ry="23" fill="#22c55e" />
            <Ellipse cx="130" cy="36"  rx="24" ry="19" fill="#4ade80" />
            {/* fruits + flowers */}
            <Circle cx="74"  cy="118" r="9"  fill="#dc2626" /><Circle cx="74"  cy="111" r="3" fill="#15803d" />
            <Circle cx="186" cy="116" r="9"  fill="#dc2626" /><Circle cx="186" cy="109" r="3" fill="#15803d" />
            <Circle cx="98"  cy="88"  r="8"  fill="#f97316" /><Circle cx="98"  cy="81"  r="3" fill="#15803d" />
            <Circle cx="162" cy="86"  r="8"  fill="#dc2626" /><Circle cx="162" cy="79"  r="3" fill="#15803d" />
            <Circle cx="54"  cy="132" r="7"  fill="#f97316" /><Circle cx="54"  cy="126" r="2.5" fill="#15803d" />
            <Circle cx="206" cy="130" r="7"  fill="#dc2626" /><Circle cx="206" cy="124" r="2.5" fill="#15803d" />
            <Circle cx="114" cy="60"  r="6"  fill="#f9a8d4" />
            <Circle cx="146" cy="58"  r="6"  fill="#fda4af" />
            <Circle cx="130" cy="48"  r="5"  fill="#f9a8d4" />
        </G>
    );
}

const TREE_MAP: Record<string, React.ReactNode> = {
    SEED:    <TreeSeed />,
    SPROUT:  <TreeSprout />,
    YOUNG:   <TreeYoung />,
    GROWING: <TreeGrowing />,
    FLOWER:  <TreeFlower />,
    FRUIT:   <TreeFruit />,
    ANCIENT: <TreeAncient />,
};

// ── Bird component (pure SVG, position driven externally) ──────────────────────
function BirdSvg({ x, y, flipX }: { x: number; y: number; flipX: boolean }) {
    const scale = flipX ? -0.85 : 0.85;
    return (
        <G transform={`translate(${x} ${y}) scale(${scale} 0.85)`}>
            <Ellipse cx="0" cy="0" rx="9" ry="6" fill="#fbbf24" />
            <Ellipse cx="3.5" cy="-1.5" rx="5" ry="3.5" fill="#f59e0b" />
            <Path d="M-9 -1 Q-14 -6 -9 -2" stroke="#fbbf24" strokeWidth="3" fill="none" strokeLinecap="round" />
            <Path d="M9 -1 Q14 -6 9 -2"   stroke="#fbbf24" strokeWidth="3" fill="none" strokeLinecap="round" />
            <Circle cx="5" cy="-2" r="1.8" fill="#1e293b" />
            <Ellipse cx="9" cy="0" rx="3" ry="1.5" fill="#ef4444" />
        </G>
    );
}

// ── Main component ─────────────────────────────────────────────────────────────
interface Props {
    tree: TreeData | null;
    onWater: () => Promise<any>;
}

export default function TreeProgressCard({ tree, onWater }: Props) {
    // ── All hooks unconditionally at the very top ─────────────────────────────
    const [watering,  setWatering]  = React.useState(false);
    const [feedback,  setFeedback]  = React.useState<string | null>(null);
    const [birdPos,   setBirdPos]   = React.useState({ x: CX, y: 120, flipX: false });

    const sway      = useSharedValue(0);
    const auraScale = useSharedValue(1);

    // Declare animated style/props immediately after shared values — no hooks after these
    const swayStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${sway.value}deg` }],
    }));
    const auraProps = useAnimatedProps(() => ({
        rx: (60 * auraScale.value) as any,
        ry: (60 * auraScale.value) as any,
    }));

    useEffect(() => {
        // Sway: rotate -1.5° → +1.5° endlessly
        sway.value = withRepeat(
            withSequence(
                withTiming(-1.5, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
                withTiming( 1.5, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
            ),
            -1,
            true,
        );
        // Aura pulse
        auraScale.value = withRepeat(
            withSequence(
                withTiming(1.12, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
                withTiming(1.00, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
            ),
            -1,
            true,
        );
        return () => {
            cancelAnimation(sway);
            cancelAnimation(auraScale);
        };
    }, []);

    // ── Bird orbit (JS-driven rAF) ──────────────────────────────────────────────
    const birdRef = React.useRef<{
        angle: number;
        perching: boolean;
        perchTimer: number;
        rafId: number;
        lastTs: number;
    }>({ angle: 0, perching: false, perchTimer: 2, rafId: 0, lastTs: 0 });

    const stage = tree?.stage ?? 'SEED';
    const stageRef = React.useRef(stage);
    stageRef.current = stage;

    useEffect(() => {
        if (!tree?.hasBird) return;

        const animate = (ts: number) => {
            const ref = birdRef.current;
            const dt  = ref.lastTs ? Math.min((ts - ref.lastTs) / 1000, 0.05) : 0.016;
            ref.lastTs = ts;

            ref.perchTimer -= dt;
            if (ref.perchTimer <= 0) {
                ref.perching   = !ref.perching;
                ref.perchTimer = ref.perching
                    ? 2 + Math.random() * 2
                    : 3 + Math.random() * 3;
            }

            const canopy = STAGE_CANOPY[stageRef.current] ?? STAGE_CANOPY.SEED;
            const scaledCY = (canopy.cy / 220) * SVG_H;

            if (ref.perching) {
                setBirdPos({ x: CX + canopy.rx * 0.3, y: scaledCY + 10, flipX: false });
            } else {
                ref.angle += 0.018;
                const r  = canopy.rx + 28 + Math.sin(ref.angle * 0.7) * 6;
                const bx = CX + Math.cos(ref.angle) * r;
                const by = scaledCY - 16 + Math.sin(ref.angle) * r * 0.3;
                setBirdPos({ x: bx, y: by, flipX: Math.cos(ref.angle) < 0 });
            }

            ref.rafId = requestAnimationFrame(animate);
        };

        birdRef.current.rafId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(birdRef.current.rafId);
    }, [tree?.hasBird]);

    // ── Water handler ────────────────────────────────────────────────────────────
    const handleWater = useCallback(async () => {
        if (watering || (tree?.health ?? 0) >= 100) return;
        setWatering(true);
        setFeedback(null);
        try {
            await onWater();
            setFeedback('💧 Tưới cây thành công!');
        } catch (err: any) {
            const msg = err?.response?.data?.message ?? 'Không thể tưới lúc này';
            setFeedback(`⚠️ ${msg}`);
        } finally {
            setWatering(false);
            setTimeout(() => setFeedback(null), 3000);
        }
    }, [watering, tree?.health, onWater]);

    // ── Early return AFTER all hooks ─────────────────────────────────────────────
    if (!tree) return null;

    const isMaxHealth = tree.health >= 100;
    const hc          = healthCfg(tree.health);
    const sky         = STAGE_SKY[tree.stage] ?? STAGE_SKY.SEED;
    const canopy      = STAGE_CANOPY[tree.stage] ?? STAGE_CANOPY.SEED;

    // Aura center in SVG coords
    const auraCY = (canopy.cy / 220) * SVG_H;

    return (
        <View style={s.card}>
            {/* ── Scene ── */}
            <View style={s.scene}>
                <Svg
                    width={SVG_W}
                    height={SVG_H}
                    viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                    style={StyleSheet.absoluteFill}
                >
                    <Defs>
                        <TrunkGrad id="trunk" />
                        <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0"   stopColor={sky[0]} />
                            <Stop offset="0.6" stopColor={sky[1]} />
                            <Stop offset="1"   stopColor="#1e4a18" />
                        </LinearGradient>
                        <RadialGradient id="glowRad" cx="50%" cy="50%" r="50%">
                            <Stop offset="0"   stopColor="#4ade80" stopOpacity="0.25" />
                            <Stop offset="1"   stopColor="#4ade80" stopOpacity="0"   />
                        </RadialGradient>
                        <RadialGradient id="auraRad" cx="50%" cy="50%" r="50%">
                            <Stop offset="0"   stopColor="#a78bfa" stopOpacity="0.30" />
                            <Stop offset="1"   stopColor="#a78bfa" stopOpacity="0"   />
                        </RadialGradient>
                        <RadialGradient id="moonRad" cx="35%" cy="35%" r="65%">
                            <Stop offset="0"   stopColor="#fef9c3" />
                            <Stop offset="1"   stopColor="#fde68a" />
                        </RadialGradient>
                        <LinearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor="#2d4a1e" />
                            <Stop offset="1" stopColor="#1a2e10" />
                        </LinearGradient>
                    </Defs>

                    {/* Sky */}
                    <Rect x="0" y="0" width={SVG_W} height={SVG_H} fill="url(#sky)" />

                    {/* Moon */}
                    <Circle cx={SVG_W - 44} cy="28" r="18" fill="url(#moonRad)" opacity="0.9" />

                    {/* Ground */}
                    <Ellipse cx={CX} cy={SVG_H + 4} rx={SVG_W * 0.6} ry={38} fill="url(#ground)" />
                    {/* Ground rim shine */}
                    <Ellipse cx={CX} cy={SVG_H - 18} rx={SVG_W * 0.35} ry={5} fill="#3d6428" opacity="0.7" />

                    {/* Aura */}
                    {tree.hasAura && (
                        <AnimatedEllipse
                            cx={CX as any}
                            cy={auraCY as any}
                            fill="url(#auraRad)"
                            animatedProps={auraProps}
                        />
                    )}

                    {/* Tree (swaying group) */}
                    {/*
                        We wrap the tree SVG group in an Animated.View for the rotation,
                        then overlay the SVG bird on top.
                        Because react-native-svg AnimatedG rotation origin is tricky,
                        we use a wrapping View with transform.
                    */}
                    {/* Glow under canopy */}
                    <Ellipse
                        cx={CX}
                        cy={SVG_H - 22}
                        rx={Math.min(canopy.rx * 0.8, 55)}
                        ry={9}
                        fill="url(#glowRad)"
                        opacity={0.6}
                    />

                    {/* The tree itself (drawn statically; sway via wrapper below) */}
                    <G x={(CX - 130)} y={(SVG_H - 210)}>
                        <Defs>
                            <LinearGradient id="trunk" x1="0" y1="0" x2="1" y2="0">
                                <Stop offset="0"   stopColor="#5c3317" />
                                <Stop offset="0.5" stopColor="#7c4a22" />
                                <Stop offset="1"   stopColor="#5c3317" />
                            </LinearGradient>
                        </Defs>
                        {TREE_MAP[tree.stage] ?? TREE_MAP.SEED}
                    </G>

                    {/* Bird */}
                    {tree.hasBird && (
                        <BirdSvg x={birdPos.x} y={birdPos.y} flipX={birdPos.flipX} />
                    )}
                </Svg>

                {/* Sway wrapper — sits over SVG, animates just the tree emoji visually.
                    Because we can't easily transform an SVG group with Reanimated in RN,
                    we do the sway on a thin absolutely-positioned overlay that contains
                    just the tree, while the background SVG stays fixed. */}
                <Animated.View
                    pointerEvents="none"
                    style={[StyleSheet.absoluteFill, swayStyle, { transformOrigin: `${CX}px ${SVG_H}px` } as any]}
                >
                    <Svg
                        width={SVG_W}
                        height={SVG_H}
                        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                        style={StyleSheet.absoluteFill}
                    >
                        <Defs>
                            <LinearGradient id="trunk2" x1="0" y1="0" x2="1" y2="0">
                                <Stop offset="0"   stopColor="#5c3317" />
                                <Stop offset="0.5" stopColor="#7c4a22" />
                                <Stop offset="1"   stopColor="#5c3317" />
                            </LinearGradient>
                        </Defs>
                        <G x={(CX - 130)} y={(SVG_H - 210)}>
                            {React.cloneElement(TREE_MAP[tree.stage] as React.ReactElement ?? TREE_MAP.SEED as React.ReactElement, {})}
                        </G>
                    </Svg>
                </Animated.View>

                {/* Water button — floating top-right */}
                <TouchableOpacity
                    style={[s.waterBtn, (watering || isMaxHealth) && s.waterBtnDisabled]}
                    onPress={handleWater}
                    disabled={watering || isMaxHealth}
                    activeOpacity={0.75}
                >
                    {watering
                        ? <ActivityIndicator size="small" color="#FFF" />
                        : <Text style={s.waterEmoji}>💧</Text>
                    }
                </TouchableOpacity>
            </View>

            {/* ── Info panel ── */}
            <View style={s.infoPanel}>
                {/* Stage row */}
                <View style={s.stageRow}>
                    <View>
                        <Text style={s.stageName}>{STAGE_CFG[tree.stage]?.name ?? '—'}</Text>
                        <Text style={s.stageDesc}>{STAGE_CFG[tree.stage]?.desc ?? ''}</Text>
                    </View>
                    <View style={s.stageBadge}>
                        <Text style={s.stageBadgeTxt}>{tree.stage}</Text>
                    </View>
                </View>

                {/* Health bar */}
                <View style={s.healthWrap}>
                    <View style={s.healthMeta}>
                        <View style={s.healthLeft}>
                            <Ionicons name="heart" size={12} color={hc.color} />
                            <Text style={[s.healthLbl, { color: hc.color }]}>{hc.label}</Text>
                        </View>
                        <Text style={[s.healthVal, { color: hc.color }]}>{tree.health}%</Text>
                    </View>
                    <View style={s.healthTrack}>
                        <View style={[s.healthFill, {
                            width: `${tree.health}%` as any,
                            backgroundColor: hc.color,
                        }]} />
                    </View>
                </View>

                {/* Stat chips */}
                <View style={s.statRow}>
                    <View style={s.statChip}>
                        <Text style={s.statIcon}>🌸</Text>
                        <Text style={s.statVal}>{tree.flowers}</Text>
                        <Text style={s.statLbl}>Hoa</Text>
                    </View>
                    <View style={s.statChip}>
                        <Text style={s.statIcon}>🍎</Text>
                        <Text style={s.statVal}>{tree.fruits}</Text>
                        <Text style={s.statLbl}>Trái</Text>
                    </View>
                    {tree.hasBird && (
                        <View style={s.statChip}>
                            <Text style={s.statIcon}>🐦</Text>
                            <Text style={s.statVal}>1</Text>
                            <Text style={s.statLbl}>Chim</Text>
                        </View>
                    )}
                    {tree.hasAura && (
                        <View style={s.statChip}>
                            <Text style={s.statIcon}>✨</Text>
                            <Text style={s.statVal}>Hào quang</Text>
                            <Text style={s.statLbl}></Text>
                        </View>
                    )}
                    <View style={[s.statChip, s.waterChip]}>
                        <TouchableOpacity
                            onPress={handleWater}
                            disabled={watering || isMaxHealth}
                            activeOpacity={0.75}
                            style={s.waterChipInner}
                        >
                            {watering
                                ? <ActivityIndicator size="small" color="#93c5fd" />
                                : <Text style={s.statIcon}>💧</Text>
                            }
                            <Text style={[s.statVal, { color: '#60a5fa' }]}>
                                {isMaxHealth ? 'Đầy' : 'Tưới'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Feedback toast */}
            {feedback && (
                <View style={s.feedback}>
                    <Text style={s.feedbackTxt}>{feedback}</Text>
                </View>
            )}
        </View>
    );
}

// ── Stage config (display strings) ────────────────────────────────────────────
const STAGE_CFG: Record<string, { name: string; desc: string }> = {
    SEED:    { name: 'Hạt mầm',      desc: 'Mới bắt đầu hành trình' },
    SPROUT:  { name: 'Mầm xanh',    desc: 'Đang nảy mầm, giữ đà nhé!' },
    YOUNG:   { name: 'Cây non',     desc: 'Đang lớn dần mỗi ngày' },
    GROWING: { name: 'Trưởng thành', desc: 'Vững chắc, tiếp tục phát triển' },
    FLOWER:  { name: 'Ra hoa',      desc: 'Kiến thức đang nở rộ!' },
    FRUIT:   { name: 'Kết trái',    desc: 'Thành quả xứng đáng với nỗ lực' },
    ANCIENT: { name: 'Cổ thụ',      desc: 'Bậc thầy tri thức!' },
};

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    card: {
        backgroundColor: '#0f1a0d',
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(120,200,80,0.18)',
        ...Platform.select({
            ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 20 },
            android: { elevation: 8 },
        }),
    },

    // Scene
    scene: {
        height: 230,
        overflow: 'hidden',
        position: 'relative',
    },

    // Water button (floating)
    waterBtn: {
        position: 'absolute',
        top: 14,
        right: 14,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#1e40af',
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios:     { shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.55, shadowRadius: 10 },
            android: { elevation: 6 },
        }),
    },
    waterBtnDisabled: { opacity: 0.4 },
    waterEmoji: { fontSize: 20 },

    // Info panel
    infoPanel: {
        backgroundColor: '#0f1a0d',
        paddingHorizontal: 18,
        paddingTop: 14,
        paddingBottom: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(74,222,128,0.12)',
    },
    stageRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    stageName: {
        fontSize: 19,
        fontWeight: '800',
        color: '#e8f5e9',
        letterSpacing: -0.3,
    },
    stageDesc: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.38)',
        marginTop: 2,
    },
    stageBadge: {
        backgroundColor: 'rgba(74,222,128,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(74,222,128,0.25)',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 5,
    },
    stageBadgeTxt: {
        fontSize: 11,
        fontWeight: '700',
        color: '#4ade80',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },

    // Health
    healthWrap:  { marginBottom: 12 },
    healthMeta:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
    healthLeft:  { flexDirection: 'row', alignItems: 'center', gap: 4 },
    healthLbl:   { fontSize: 11, fontWeight: '600', letterSpacing: 0.4, textTransform: 'uppercase' },
    healthVal:   { fontSize: 13, fontWeight: '800' },
    healthTrack: { height: 5, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 10, overflow: 'hidden' },
    healthFill:  { height: '100%', borderRadius: 10 },

    // Stats
    statRow:  { flexDirection: 'row', gap: 8 },
    statChip: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.07)',
        borderRadius: 14,
        paddingVertical: 10,
        paddingHorizontal: 6,
        alignItems: 'center',
        gap: 3,
    },
    waterChip: {
        borderColor: 'rgba(96,165,250,0.25)',
        backgroundColor: 'rgba(30,64,175,0.15)',
    },
    waterChipInner: { alignItems: 'center', gap: 3 },
    statIcon: { fontSize: 16 },
    statVal:  { fontSize: 14, fontWeight: '700', color: '#e8f5e9' },
    statLbl:  { fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.3, textTransform: 'uppercase' },

    // Feedback
    feedback: {
        backgroundColor: 'rgba(22,101,52,0.85)',
        marginHorizontal: 16,
        marginBottom: 14,
        borderRadius: 12,
        paddingVertical: 9,
        paddingHorizontal: 14,
        alignItems: 'center',
    },
    feedbackTxt: { fontSize: 12, fontWeight: '700', color: '#86efac' },
});
