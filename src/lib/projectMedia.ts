import healthcareImg from "../assets/images/healthcare.png";
import forumImg from "../assets/images/forum.png";
import todoImg from "../assets/images/todo.png";
import scoringImg from "../assets/images/scoring.png";
import movieImg from "../assets/images/movie.png";
import quizImg from "../assets/images/quiz.png";
import restaurantImg from "../assets/images/restaurant.png";
import petsImg from "../assets/images/pets.png";
import healthhomeImg from "../assets/images/healthhome.png";
import forumhomeImg from "../assets/images/forumhome.png";

const legacyMediaMap: Record<string, string> = {
  "1": healthcareImg,
  "2": forumImg,
  "3": todoImg,
  "4": scoringImg,
  "5": movieImg,
  "6": quizImg,
  "7": restaurantImg,
  "8": petsImg,
  "../assets/images/healthcare.png": healthcareImg,
  "../assets/images/forum.png": forumImg,
  "../assets/images/todo.png": todoImg,
  "../assets/images/scoring.png": scoringImg,
  "../assets/images/movie.png": movieImg,
  "../assets/images/quiz.png": quizImg,
  "../assets/images/restaurant.png": restaurantImg,
  "../assets/images/pets.png": petsImg,
  "/images/pet.png": petsImg,
  "../assets/images/healthhome.png": healthhomeImg,
  "../assets/images/forumhome.png": forumhomeImg,
};

export function resolveProjectMedia(
  source?: string,
  fallbackKey?: string,
): string {
  if (source && legacyMediaMap[source]) {
    return legacyMediaMap[source];
  }

  if (source) {
    return source;
  }

  if (fallbackKey && legacyMediaMap[fallbackKey]) {
    return legacyMediaMap[fallbackKey];
  }

  return "";
}
