-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sty 20, 2026 at 08:03 PM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gym_app`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `exercises`
--

CREATE TABLE `exercises` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `muscle_group` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `exercises`
--

INSERT INTO `exercises` (`id`, `name`, `muscle_group`) VALUES
(1, 'bench press', 'chest'),
(2, 'Squat', 'legs'),
(3, 'Deadlift', 'back'),
(4, 'Overhead Press', 'shoulders'),
(5, 'Pull Up', 'back'),
(6, 'Dumbbell Row', 'back'),
(7, 'Lunges', 'legs'),
(8, 'Bicep Curl', 'biceps'),
(9, 'Tricep Dip', 'triceps'),
(10, 'Lateral Raise', 'shoulders'),
(11, 'Leg Press', 'legs'),
(12, 'Plank', 'core'),
(13, 'Push Up', 'chest'),
(14, 'Incline Dumbbell Press', 'chest');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `exercises_in_workouts`
--

CREATE TABLE `exercises_in_workouts` (
  `id` int(11) NOT NULL,
  `workout_id` int(11) NOT NULL,
  `exercise_id` int(11) NOT NULL,
  `sets` int(11) DEFAULT NULL,
  `reps` int(11) DEFAULT NULL,
  `exercise_order` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `exercises_in_workouts`
--

INSERT INTO `exercises_in_workouts` (`id`, `workout_id`, `exercise_id`, `sets`, `reps`, `exercise_order`) VALUES
(1, 1, 1, 3, 8, 1),
(2, 1, 2, 3, 8, 2),
(3, 1, 3, 3, 8, 3);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(30) DEFAULT NULL,
  `surname` varchar(30) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `surname`, `email`, `password`) VALUES
(2, 'jan', 'kowalski', 'jan@kowalski.pl', '$2b$10$IsqSibQmr4DUInNuyWpFQ.M0rVZPcpf1xC4F1Qse091VRe.x9aXam'),
(3, 'Natalia', 'Lubomska', 'natalialubomska@gmail.com', '$2b$10$Ji6fLVJzXnSVmPb1YbHuv.NMRIfECaOklumQETMiUaR2RmZgg4HXu'),
(4, 'Damian', 'Skrzypek', 'skrzypek@op.pl', '$2b$10$YcMFj5xCdF5pjcxg6Fp7juQj2JCUDUvVTRNyPm7fnPOOaCDJ.oimC');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users_workouts`
--

CREATE TABLE `users_workouts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `workout_id` int(11) NOT NULL,
  `workout_date` date DEFAULT curdate(),
  `workout_comment` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users_workouts`
--

INSERT INTO `users_workouts` (`id`, `user_id`, `workout_id`, `workout_date`, `workout_comment`) VALUES
(1, 3, 1, '2026-01-20', 'hard workout'),
(2, 3, 1, '2026-01-25', 'hard workout');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `workouts`
--

CREATE TABLE `workouts` (
  `id` int(11) NOT NULL,
  `author_id` int(11) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `difficulty` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `workouts`
--

INSERT INTO `workouts` (`id`, `author_id`, `name`, `description`, `difficulty`) VALUES
(1, 3, 'Strength workout', 'some description', 3),
(2, 3, 'Strength workout', 'some description', 4);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `workouts_results`
--

CREATE TABLE `workouts_results` (
  `id` int(11) NOT NULL,
  `user_workout_id` int(11) NOT NULL,
  `exercise_id` int(11) NOT NULL,
  `set_nr` int(11) DEFAULT NULL,
  `reps` int(11) DEFAULT NULL,
  `used_weight` decimal(5,2) DEFAULT NULL,
  `difficulty` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `exercises`
--
ALTER TABLE `exercises`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `exercises_in_workouts`
--
ALTER TABLE `exercises_in_workouts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `workout_id` (`workout_id`),
  ADD KEY `exercise_id` (`exercise_id`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indeksy dla tabeli `users_workouts`
--
ALTER TABLE `users_workouts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `workout_id` (`workout_id`);

--
-- Indeksy dla tabeli `workouts`
--
ALTER TABLE `workouts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `author_id` (`author_id`);

--
-- Indeksy dla tabeli `workouts_results`
--
ALTER TABLE `workouts_results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_workout_id` (`user_workout_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `exercises`
--
ALTER TABLE `exercises`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `exercises_in_workouts`
--
ALTER TABLE `exercises_in_workouts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users_workouts`
--
ALTER TABLE `users_workouts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `workouts`
--
ALTER TABLE `workouts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `workouts_results`
--
ALTER TABLE `workouts_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `exercises_in_workouts`
--
ALTER TABLE `exercises_in_workouts`
  ADD CONSTRAINT `exercises_in_workouts_ibfk_1` FOREIGN KEY (`workout_id`) REFERENCES `workouts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `exercises_in_workouts_ibfk_2` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users_workouts`
--
ALTER TABLE `users_workouts`
  ADD CONSTRAINT `users_workouts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `users_workouts_ibfk_2` FOREIGN KEY (`workout_id`) REFERENCES `workouts` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `workouts`
--
ALTER TABLE `workouts`
  ADD CONSTRAINT `workouts_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `workouts_results`
--
ALTER TABLE `workouts_results`
  ADD CONSTRAINT `workouts_results_ibfk_1` FOREIGN KEY (`user_workout_id`) REFERENCES `users_workouts` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
