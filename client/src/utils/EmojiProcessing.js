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
        return '10px';
      case 'sm':
        return '20px';
      case 'md':
        return '50px';
      case 'lg':
        return '80px';
      case 'xl':
        return '120px';
      case 'xxl':
        return '200px';
      case 'xxxl':
        return '400px';
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
