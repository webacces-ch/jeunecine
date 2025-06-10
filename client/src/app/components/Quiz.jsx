"use client";
"use client";
import React, { useState } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

const quiz = [
	{
		question: "Qui sommes-nous ?",
		options: [
			{ text: "Une asso de jeunes passionnés de cinéma !", correct: true },
			{ text: "Une secte de fans de popcorn", correct: false },
			{ text: "Un club secret d'espions cinéphiles", correct: false },
		],
	},
	{
		question: "Notre mission principale ?",
		options: [
			{
				text: "Organiser des concours de mangeurs de pop-corn",
				correct: false,
			},
			{ text: "Former la prochaine génération de super-héros", correct: false },
			{ text: "Partager la magie du 7ème art !", correct: true },
		],
	},
	{
		question: "Où nous retrouver ?",
		options: [
			{ text: "Dans les salles obscures et sur les réseaux !", correct: true },
			{ text: "Dans une grotte secrète sous Paris", correct: false },
			{
				text: "Sur la Lune, lors de projections interstellaires",
				correct: false,
			},
		],
	},
];

const transitionDuration = 400;

// Confetti utilitaire
function launchConfettiSideCannons() {
	const end = Date.now() + 1 * 1000; // 2 seconds
	const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

	const frame = () => {
		if (Date.now() > end) return;

		confetti({
			particleCount: 2,
			angle: 60,
			spread: 55,
			startVelocity: 60,
			origin: { x: 0, y: 0.5 },
			colors: colors,
		});
		confetti({
			particleCount: 2,
			angle: 120,
			spread: 55,
			startVelocity: 60,
			origin: { x: 1, y: 0.5 },
			colors: colors,
		});

		requestAnimationFrame(frame);
	};

	frame();
}

export default function Quiz() {
	const [step, setStep] = useState(0);
	const [selected, setSelected] = useState(null);
	const [showAnswer, setShowAnswer] = useState(false);
	const [animating, setAnimating] = useState(false);

	const handleOptionClick = (idx) => {
		if (showAnswer) return;
		setSelected(idx);
		setShowAnswer(true);
		// Lancer les confettis seulement si la réponse est correcte
		if (quiz[step].options[idx].correct) {
			launchConfettiSideCannons();
		}
		setTimeout(() => {
			setAnimating(true);
			setTimeout(() => {
				setStep((s) => (s + 1 < quiz.length ? s + 1 : 0));
				setSelected(null);
				setShowAnswer(false);
				setAnimating(false);
			}, transitionDuration);
		}, 1200);
	};

	const current = quiz[step];

	return (
		<section className="flex flex-col items-center justify-center min-h-[60vh] py-12 bg-neutral-50">
			<h1 className="text-6xl md:text-10xl  tracking-tight font-semibold mb-8 text-[#222222] ">
				Quiz !
			</h1>
			<div className=" py-12 px-6 md:py-12 md:px-32 flex flex-col gap-5 w-11/12 max-w-xxl mx-auto transition-[width] duration-300 ease-in-out">
				<div
					className={`transition-all flex flex-col gap-4 duration-300 ease-in-out ${
						animating ? "-translate-y-3 opacity-0" : "translate-y-0 opacity-100"
					}`}
					key={step}
				>
					<motion.h2
						className="text-4xl md:text-5xl font-semibold text-center text-[#222222] mb-10 drop-shadow-lg"
						key={step}
						initial="hidden"
						animate="visible"
						variants={{
							hidden: {},
							visible: {},
						}}
					>
						{current.question.split("").map((char, i) => (
							<motion.span
								key={i}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{
									delay: 0.02 * i,
									duration: 0.4,
									ease: [0.4, 0, 0.2, 1],
								}}
								style={{ display: char === " " ? "inline-block" : "inline" }}
							>
								{char === " " ? '\u00A0' : char}
							</motion.span>
						))}
					</motion.h2>
					{current.options.map((opt, idx) => {
						let base =
							"transition-all duration-300 ease-in-out text-lg md:text-xl font-semibold py-4 px-6 rounded-2xl border border-[#D5D5D5] cursor-pointer hover:bg-neutral-200 focus:outline-none ";
						let color = "bg-white text-[#222222]";
						if (showAnswer) {
							if (idx === selected && opt.correct)
								color =
									"bg-green-50 hover:bg-green-50 text-green-700 border-green-200 scale-105";
							else if (idx === selected && !opt.correct)
								color =
									"bg-red-50 hover:bg-red-50 text-red-700 border-red-200 shake";
							else if (opt.correct)
								color =
									"bg-green-50 hover:bg-green-50 text-green-700 border-green-200";
							else color = "bg-gray-50 text-gray-500";
						}
						return (
							<button
								key={idx}
								className={base + color}
								onClick={() => handleOptionClick(idx)}
								disabled={showAnswer}
								style={{ transition: "all 0.3s cubic-bezier(.4,2,.6,1)" }}
							>
								{opt.text}
							</button>
						);
					})}
				</div>
			</div>
			<style jsx>{`
				.animate-fade-in {
					animation: fadeIn 0.2s ease-out;
				}
				.animate-slide-up {
					animation: slideUp 0.4s ease-in-out;
				}
				.shake {
					animation: shake 0.4s cubic-bezier(0.4, 2, 0.6, 1);
				}
				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: translateY(10px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
				@keyframes slideUp {
					from {
						opacity: 0;
						transform: translateY(10px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
				@keyframes shake {
					10%,
					90% {
						transform: translateX(-2px);
					}
					20%,
					80% {
						transform: translateX(4px);
					}
					30%,
					50%,
					70% {
						transform: translateX(-8px);
					}
					40%,
					60% {
						transform: translateX(8px);
					}
				}
			`}</style>
		</section>
	);
}
