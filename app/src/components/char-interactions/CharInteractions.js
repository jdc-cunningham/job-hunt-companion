import Char from "../../assets/images/waifu_labs_char.png";
import "./CharInteractions.scss";

const CharacterInteractions = (props) => {
  return (
    <div className="CharacterInteractions">
      <div class="CharacterInteractions__character-bg">
        <img class="CharacterInteractions__character" src={Char} alt="anime character"/>
      </div>
      <h2>Job-chan</h2>
      <textarea className="CharacterInteractions__input" value="Have you applied to any jobs today?"/>
    </div>
  );
}

export default CharacterInteractions;