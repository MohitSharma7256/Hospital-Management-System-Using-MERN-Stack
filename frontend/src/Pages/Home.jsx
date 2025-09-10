import React, { useContext } from "react";
import Hero from "../components/Hero";
import Biography from "../components/Biography";
import Departments from "../components/Departments";
import News from "../components/News";
import MessageForm from "../components/MessageForm";
import { Context } from "../main";

const Home = () => {
  const { isAuthenticated } = useContext(Context);
  return (
    <>
      <Hero
        title={
          "Welcome to Shaan Hospital | Your Trusted Healthcare Provider"
        }
        imageUrl={"/hero.png"}
      />
      <Biography imageUrl={"/about.png"} name="Shaan Hospital" />
      <Departments />
      <News />
      <MessageForm />
    </>
  );
};

export default Home;
