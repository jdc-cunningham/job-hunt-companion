import React, { useState, useEffect } from 'react';
import Char from "../../assets/images/waifu_labs_char.png";
import HalfBlinkChar from "../../assets/images/waifu_labs_char_half_blink.png";
import FullBlinkChar from "../../assets/images/waifu_labs_char_full_blink.png";
import "./CharInteractions.scss";

const CharacterInteractions = (props) => {
  const charImages = [Char, HalfBlinkChar, FullBlinkChar];
  const [blinkState, setBlinkState] = useState(0);

  const welcomeMsg = "Have you applied to any jobs today?";
  const [msgCharId, setMsgCharId] = useState(0);

  const updateMsg = () => {
    if (msgCharId < welcomeMsg.length - 1) {
      setMsgCharId(msgCharId + 1);
    } else {
      setMsgCharId(0);
    }
  }

  const updateBlinkState = () => {
    if (blinkState < 2) {
      setBlinkState(blinkState + 1);
    } else {
      setBlinkState(0);
    }
  }

  useEffect(() => {
    const msgDelay = msgCharId === welcomeMsg.length - 1 ? 3000 : 100;

    setTimeout(() => {
      updateMsg();
    }, msgDelay);
  }, [msgCharId]);

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
      <textarea className="CharacterInteractions__input" value={welcomeMsg.substring(0, msgCharId + 1)}/>
    </div>
  );
}

export default CharacterInteractions;