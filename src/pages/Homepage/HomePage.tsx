import { CssBaseline, createTheme, ThemeProvider } from "@mui/material";
import Footer from "./components/Footer";
import NavBar from "../../components/Navbar";
import CardsLayout from "./components/CardsLayout";
import { useEffect, useState } from "react";
import { FlashCard } from "../../types/card.interface";
import React from "react";
import { CleaningServices } from "@mui/icons-material";
import axios from "axios";

export default function Homepage() {
  const [flashCards, setFlashCards] = useState<FlashCard[]>();

  const deleteFlashCard = (id: number) => {
    axios
      .delete(`http://localhost:4000/flashcards/${id}`)
      .then(() => {
        setFlashCards((prevCards) =>
          prevCards?.filter((card) => card.id !== id)
        );
      })
      .catch((error) => {
        console.error("error deleting flashcard", error);
      });
  };

  const addFlashCard = (
    question: string,
    answer: string,
    category: string,
    difficultyLevel: string
  ) => {
    const flashcardData = {
      question: question,
      answer: answer,
      category: category,
      difficultyLevel: difficultyLevel,
    };
    console.log("1");
    axios
      .post(`http://localhost:4000/flashcards`, flashcardData)
      .then((response) => {
        const newCard: FlashCard = response.data;
        console.log("2");
        setFlashCards((prevCards) => {
          if (prevCards === undefined) {
            return [newCard];
          }
          return [...prevCards, newCard];
        });
        console.log("card added successfully");
      })
      .catch((error) => {
        console.error("error adding flashcard", error);
      });
  };

  useEffect(() => {
    // Currently just doing some WOW effect to see, remove this timeout when we have data handling
    // setTimeout(() => {
    //   setFlashCards(initialCardsData);
    // }, 1000);

    const fetchFlashCards = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/flashcards`);
        setFlashCards(res.data);
      } catch (error) {
        console.error("error fetching data", error);
      }
    };

    fetchFlashCards();
    // TODO:
    // 1. fetch data from backend
    // 2. set data to state
  }, []);

  return (
    <>
      <NavBar />
      <main>
        <CardsLayout
          cards={flashCards}
          deleteFlashCard={deleteFlashCard}
          addFlashCard={addFlashCard}
        />
      </main>
      <Footer />
    </>
  );
}
