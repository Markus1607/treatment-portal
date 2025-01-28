export const defaultValues = {
  otherTreatments: [],
  sessionComparison: '',
  usefulFeatures: [],
  recommend: '',
  clinicalComments: '',
  confidence: 5,
  useFrequently: 5,
  learnALot: 5,
  complex: 5,
  coverNeeds: '',
  enjoyComments: '',
};

export function formatFeedbackData(obj) {
  return {
    performed_other_treatments: obj.otherTreatments,
    ...(!isNaN(parseInt(obj.sessionComparison)) && {
      compare_treatments: parseInt(obj.sessionComparison),
    }),
    most_useful_features: obj.usefulFeatures,
    ...(!isNaN(parseInt(obj.recommend)) && {
      recommend_app: parseInt(obj.recommend),
    }),
    confidence: obj.confidence,
    comments: obj.clinicalComments,
    like_to_use: obj.useFrequently,
    learning_required: obj.learnALot,
    complex: obj.complex,
    ...(!isNaN(parseInt(obj.coverNeeds)) && {
      covers_all_needs: parseInt(obj.coverNeeds),
    }),
    enjoy_most: obj.enjoyComments,
  };
}
