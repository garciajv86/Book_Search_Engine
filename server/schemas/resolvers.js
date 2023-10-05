//* import user model
const { User } = require('../models');
//* import sign token function from auth
const { signToken } = require('../utils/auth');

const resolvers = {
    //* By adding context to our query, we can retrieve the logged in user without specifically searching for them
    Query: {
      me: async (_, __, context) => {
        if (context.user) {
          return await User.findById(context.user._id);
        }
        throw new Error('You are not authenticated.');
      },
    },
    Mutation: {
      login: async (_, { email, password }) => {
        const user = await User.findOne({ email });
  
        if (!user) {
          throw new Error("Can't find this user");
        }
  
        const correctPw = await user.isCorrectPassword(password);
  
        if (!correctPw) {
          throw new Error('Wrong password!');
        }
  
        const token = signToken(user);
  
        return { token, user };
      },
      addUser: async (_, args) => {
        const user = await User.create(args);
  
        if (!user) {
          throw new Error('Something is wrong!');
        }
  
        const token = signToken(user);
  
        return { token, user };
      },
      saveBook: async (_, { input }, context) => {
        if (context.user) {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: input } },
            { new: true, runValidators: true }
          );
  
          return updatedUser;
        }
        throw new Error('You are not authenticated.');
      },
      removeBook: async (_, { bookId }, context) => {
        if (context.user) {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId } } },
            { new: true }
          );
  
          if (!updatedUser) {
            throw new Error("Couldn't find user with this id!");
          }
  
          return updatedUser;
        }
        throw new Error('You are not authenticated.');
      },
    },
  };
  
  module.exports = resolvers;
  