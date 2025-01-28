import { sample, concat } from 'lodash';
import { getRandomInt } from 'utils/functions';

const getUniqueID = () => getRandomInt(1000, 9000);

export const makePatientFeedback = (number) => {
  const akQuestions = [];
  const satisfactionQuestions = [];
  const date = ['10/06/2021', '30/08/2020', '05/02/2020', '01/09/2020'];
  for (let i = 0; i < number; i++) {
    akQuestions.push({
      id: getUniqueID(),
      type: 'akQues',
      date: sample(date),
      title: 'Patient_details.feedback_actinic_title',
      answers: {
        1: 'Nothing',
        2: 'Quite',
        3: 'A little',
        4: 'A little',
        5: 'Nothing',
        6: 'Nothing',
        7: 'Nothing',
        8: 'Nothing',
        9: 'A lot',
      },
    });
  }
  for (let i = 0; i < number; i++) {
    satisfactionQuestions.push({
      id: getUniqueID(),
      type: 'satisfactionQues',
      date: sample(date),
      title: 'Patient_details.feedback_satisfaction_title',
      answers: {
        1: 'Worse',
        2: 'Yes',
        3: 'Yes',
        4: ['5-5% fluorouracil', '5-fluorouracil 0.5%', 'Surgery'],
        5: 'Worse',
        6: 'dPDT applied by your doctor and / or nurse only (without SmartPDT)',
        7: 'Yes',
        8: '1',
        9: '2',
        10: '7',
        11: '10',
        12: 'Test comment',
      },
    });
  }
  return concat(akQuestions, satisfactionQuestions);
};
