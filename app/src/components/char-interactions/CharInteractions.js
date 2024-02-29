import React, { useState, useEffect, useRef } from 'react';
import Char from "../../assets/images/waifu_labs_char.png";
import HalfBlinkChar from "../../assets/images/waifu_labs_char_half_blink.png";
import FullBlinkChar from "../../assets/images/waifu_labs_char_full_blink.png";
import "./CharInteractions.scss";

const CharacterInteractions = (props) => {
  const charImages = [Char, HalfBlinkChar, FullBlinkChar];
  const [blinkState, setBlinkState] = useState(0);

  const updateBlinkState = () => {
    if (blinkState < 2) {
      setBlinkState(blinkState + 1);
    } else {
      setBlinkState(0);
    }
  }

  useEffect(() => {
    const blinkDelay = blinkState > 0 ? 150 : 1000;

    setTimeout(() => {
      updateBlinkState();
    }, blinkDelay);
  }, [blinkState]);

  return (
    <div className="CharacterInteractions">
      <div className="CharacterInteractions__character-bg">
        <img className="CharacterInteractions__character anim-up-down" src={charImages[blinkState]} alt="anime character"/>
      </div>
      <h2>Job-chan</h2>
      <textarea className="CharacterInteractions__input" value="Have you applied to any jobs today?"/>
    </div>
  );
}

export default CharacterInteractions;