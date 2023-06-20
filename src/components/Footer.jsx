import React from "react";

function Footer() {
  return (
    <footer
      className={
        "p-4  shadow md:flex md:items-center md:justify-center md:p-6 dark:bg-gray-800 fixed bottom-0"
      }
    >
      <span className="text-sm text-white sm:text-center dark:text-white">
        © 2022{" "}
        <a
          href="https://github.com/ALsJourney"
          target={"_blank"}
          className="hover:underline"
        >
          ALsJourney
        </a>
        . Video by{" "}
        <a
          href={
            "https://www.youtube.com/watch?v=TRXdxiot5JM&ab_channel=Bizonacci"
          }
          className="hover:underline"
          target={"_blank"}
        >
          Bizonacci
        </a>
      </span>
    </footer>
  );
}

export default Footer;
