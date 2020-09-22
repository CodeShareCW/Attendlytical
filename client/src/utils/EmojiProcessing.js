import React from 'react';
import FacebookEmoji from 'react-facebook-emoji';
import { EmojiExpressionsType } from '../globalData';

/*
  exp: neutral, surprised, angry...
  size: sm, md...
*/

export const EmojiProcessing = ({ exp, size }) => {
  const alternativeSize = (s) => {
    switch (s) {
      case 'xxs':
        return '5px';
      case 'xs':
        return '20px';
      case 'sm':
        return '30px';
      case 'md':
        return '40px';
      case 'lg':
        return '50px';
      case 'xl':
        return '60px';
      case 'xxl':
        return '70px';
      case 'xxxl':
        return '100px';
    }
  };

  const emojiExpression = EmojiExpressionsType.find(
    (type) => type.expression === exp
  );
  if (
    emojiExpression.expression === 'disgusted' ||
    emojiExpression.expression === 'fearful'
  )
    return (
      <strong style={{ fontSize: alternativeSize(size) }}>
        {emojiExpression.emoji}
      </strong>
    );
  return <FacebookEmoji type={emojiExpression.emoji} size={size} />;
};
