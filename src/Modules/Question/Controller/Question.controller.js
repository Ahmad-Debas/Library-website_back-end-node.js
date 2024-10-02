import QuestionModel from "../../../../DB/model/Question.mode.js";
export const createQuestion = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const newQuestion = await QuestionModel.create({
      question,
      answer,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });
    return res.status(201).json({ message: "success", question: newQuestion });
  } catch (error) {
    return res.status(500).json({ message: "error", error: error.stack });
  }
};

export const getAllQuestions = async (req, res) => {
  try {
    const questions = await QuestionModel.find();

    return res.status(200).json({ message: "success", questions });
  } catch (error) {
    return res.status(500).json({ message: "error", error: error.stack });
  }
};

export const getQuestion = async(req,res)=>{

    const question  = await QuestionModel.findById(req.params.id);
    return res.status(200).json({ message: "success", question});

}

export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;

    const updatedQuestion = await QuestionModel.findByIdAndUpdate(
      id,
      {
        question,
        answer,
        updatedBy: req.user._id,
      },
      { new: true }
    );

    return res.status(200).json({ message: "success", question: updatedQuestion });
  } catch (error) {
    return res.status(500).json({ message: "error", error: error.stack });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedQuestion = await QuestionModel.findByIdAndDelete(id);

    return res.status(200).json({ message: "success", question: deletedQuestion });
  } catch (error) {
    return res.status(500).json({ message: "error", error: error.stack });
  }
};
