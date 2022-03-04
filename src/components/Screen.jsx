import {Textfit} from 'react-textfit';
import '../stylesheets/Style.css';

const Screen = ({value}) => {
  return (
    <Textfit className="screen" mode="single" max={70}>
      {isNaN(value) ? 'Not a number' : value}
    </Textfit>
  );
};

export default Screen;
