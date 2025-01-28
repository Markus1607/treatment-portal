import { isNumber } from 'lodash';
import { AutocompletePrediction, Suggestion } from 'react-places-autocomplete';

export const setFieldValue = (data: number) => {
  return isNumber(data) ? (data < 1 ? 0 : data) : '';
};

export const getMaxDuration = (data: number) => {
  return isNumber(data) ? Math.max(data, 1) : '';
};

export const getPpixDose = (data: number) => {
  if (!isNumber(data)) return '';
  if (data < 30000) {
    return 3;
  } else if (data > 1000000) {
    return 100;
  } else {
    //To one decimal place
    return Math.round((data / 10000) * 10) / 10;
  }
};

export const formatPredictions = (
  predictions: AutocompletePrediction[]
): Suggestion[] => {
  const formattedSuggestion = (
    structured_formatting: AutocompletePrediction['structured_formatting']
  ): Suggestion['formattedSuggestion'] => ({
    mainText: structured_formatting.main_text,
    secondaryText: structured_formatting.secondary_text,
  });

  return predictions?.map((p: AutocompletePrediction, idx: number) => ({
    id: p.place_id,
    description: p.description,
    placeId: p.place_id,
    active: idx === 0 ? true : false,
    index: idx,
    formattedSuggestion: formattedSuggestion(p.structured_formatting),
    matchedSubstrings: p.matched_substrings,
    terms: p.terms,
    types: p.types,
  }));
};
