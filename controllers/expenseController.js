const Expense = require("../models/expense.model");

const getExpenses = async (req, res) => {
  try {
    const { filter, startDate, endDate } = req.query;
    let query = { user: req.user._id };

    if (filter) {
      const now = new Date();
      let dateThreshold = new Date();
      switch (filter) {
        case "week":
          dateThreshold.setDate(now.getDate() - 7);
          query.createdAt = { $gte: dateThreshold };
          break;

        case "month":
          dateThreshold.setMonth(now.getMonth() - 1);
          query.createdAt = { $gte: dateThreshold };
          break;

        case "3months":
          dateThreshold.setMonth(now.getMonth() - 3);
          query.createdAt = { $gte: dateThreshold };
          break;

        case "custom":
          if (startDate && endDate) {
            query.createdAt = {
              $gte: new Date(startDate), //range start
              $lte: new Date(endDate), //range end
            };
          }
          break;

        default:
          break;
      }
    }
    const expense = await Expense.find(query).sort({ createdAt: -1 });

    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addExpense = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User Not Authenticated" });
    }
    const { name, amount, category, credit } = req.body;

    const expense = await Expense.create({
      user: req.user._id,
      name,
      amount,
      category,
      credit,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id, //whole obj returned by ._id
    });
    if (!expense) {
      return res.status(404).json({
         message: "Expense not Found" 
      });
    }
    res.status(200).json({
       id: req.params.id, 
       message: "Expense removed", 
       deletedExpense:expense
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const updateExpense = async (req, res) => {
//   try {
//     const expense = await Expense.findOneAndUpdate(
//       {
//         _id: req.params.id,
//         user: req.user._id,
//       },
//       req.body,
//       { new: true }, //return updated obj
//     );
//     if (!expense) {
//       return res.status(404).json({ message: "Expense not found" });
//     }
//     res.status(200).json(expense);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
const updateExpense = async (req, res) => {
  try {
    
    const { name, amount, category, credit } = req.body;

    const updateData = {
        name,
        amount,
        category,
        credit
    };

    const expense = await Expense.findOneAndUpdate(
      { 
        _id: req.params.id, 
        user: req.user._id 
      },
      updateData, 
      { new: true,
        runValidators:true
       } 
    );

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    getExpenses,
    addExpense,
    deleteExpense,
    updateExpense
};
