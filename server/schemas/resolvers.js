const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
      me: async (parent, args, context) => {
        if (context.user) {
          return User.findOne({ _id: context.user._id });
        }
        throw new AuthenticationError('You need to be logged in!');
      },
      },
      Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
      
            if (!user) {
              throw new AuthenticationError('Incorrect email or password!');
            }
      
            const correctPw = await user.isCorrectPassword(password);
      
            if (!correctPw) {
              throw new AuthenticationError('Incorrect email or password!');
            }
      
            const token = signToken(user);
            return { token, user };
          },

          addUser: async (parent, args) => {
            const user = await User.create(args)
            const token = signToken(user)

            return {token, user};
          },

          saveBook: async (parent, {bookData}) => {
            const updatedUser = await User.findByIdAndUpdate(
                {_id: user._id},
                {$push: {savedBooks:bookData}},
                {new: true, runValidators: true}
            );

            return updatedUser;
          },

          removeBook: async(parent, {bookId}) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $pull: { savedBooks: { bookId: bookId } } },
                { new: true }
              ); 

              return updatedUser;
          },
      },
};

module.exports = resolvers;