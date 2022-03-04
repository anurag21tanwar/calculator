import React, {useState} from 'react';
import Wrapper from './components/Wrapper';
import Screen from './components/Screen';
import ButtonBox from './components/ButtonBox';
import Button from './components/Button';

const MAX_DIGIT_LENGTH = 9;

const buttonLabels = [
  ['AC', '+/-', '%', '/'],
  [7, 8, 9, '*'],
  [4, 5, 6, '-'],
  [1, 2, 3, '+'],
  [0, '.', '='],
];

const fetchClass = (label) => {
  if (label === 'AC') {
    return 'button red';
  } else if (label === '=') {
    return 'button green';
  } else if (['+', '-', '*', '/'].includes(label)) {
    return 'button yellow';
  } else if (['+/-', '%'].includes(label)) {
    return 'button blue';
  } else {
    return 'button';
  }
};

const toLocaleString = (num) =>
  String(num).replaceAll(/,/g, '')
      .replaceAll(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1,');

const removeCommaAndSpaces = (num) =>
  num.toString().replaceAll(/,/g, '').replaceAll(/\s/g, '');

const Calculator = () => {
  const [calc, setCalc] = useState({
    sign: '',
    num: 0,
    res: 0,
  });

  const fetchHandler = (label) => {
    return label === 'AC' ? resetHandler :
      label === '+/-' ? invertHandler :
        label === '%' ? percentHandler :
          label === '=' ? equalsHandler :
            label === '+' || label === '-' ||
            label === '*' || label === '/' ? operatorHandler :
              label === '.' ? dotHandler : numHandler;
  };

  const numHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;

    console.log('numHandler');

    if (removeCommaAndSpaces(calc.num).length < MAX_DIGIT_LENGTH) {
      setCalc({
        ...calc,
        num:
            calc.num === 0 && value === '0' ? '0' :
              !calc.num.toString().includes('.') &&
              removeCommaAndSpaces(calc.num) % 1 === 0 ?
                toLocaleString(Number(removeCommaAndSpaces(calc.num + value))) :
                    toLocaleString(removeCommaAndSpaces(calc.num + value)),
        res: !calc.sign ? 0 : calc.res,
      });
    }
  };

  const dotHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;

    console.log('dotHandler');

    setCalc({
      ...calc,
      num: !calc.num.toString().includes('.') ? calc.num + value : calc.num,
    });
  };

  const operatorHandler = (e) => {
    const value = e.target.innerHTML;

    console.log('operatorHandler');

    setCalc({
      ...calc,
      sign: value,
      num: 0,
      res: !calc.res && calc.num ? calc.num : calc.res,
    });
  };

  const equalsHandler = () => {
    if (calc.sign && calc.num) {
      const math = (a, b, sign) => {
        return (
            sign === '+' ? a + b :
                sign === '-' ? a - b :
                    sign === '*' ? a * b :
                        a / b
        );
      };

      console.log('equalsHandler');

      setCalc({
        ...calc,
        res:
            calc.num === '0' && calc.sign === '/' ? 'NaN' :
                toLocaleString(math(Number(removeCommaAndSpaces(calc.res)),
                    Number(removeCommaAndSpaces(calc.num)), calc.sign)),
        sign: '',
        num: 0,
      });
    }
  };

  const invertHandler = () => {
    console.log('invertHandler');

    setCalc({
      ...calc,
      num: calc.num ? toLocaleString(removeCommaAndSpaces(calc.num) * -1) : 0,
      res: calc.res ? toLocaleString(removeCommaAndSpaces(calc.res) * -1) : 0,
      sign: '',
    });
  };

  const percentHandler = () => {
    let num = calc.num ? parseFloat(removeCommaAndSpaces(calc.num)) : 0;
    let res = calc.res ? parseFloat(removeCommaAndSpaces(calc.res)) : 0;

    console.log('percentHandler');

    setCalc({
      ...calc,
      num: (num /= Math.pow(100, 1)),
      res: (res /= Math.pow(100, 1)),
      sign: '',
    });
  };

  const resetHandler = () => {
    console.log('resetHandler');

    setCalc({
      ...calc,
      sign: '',
      num: 0,
      res: 0,
    });
  };

  console.log('currentState=', calc);

  return (
    <Wrapper>
      <Screen value={calc.num ? calc.num : calc.res} />
      <ButtonBox>
        {
          buttonLabels.flat().map((label, i) => {
            return (
              <Button
                key={i}
                className={fetchClass(label)}
                value={label}
                onClick={fetchHandler(label)}
              />
            );
          })
        }
      </ButtonBox>
    </Wrapper>
  );
};

export default Calculator;
