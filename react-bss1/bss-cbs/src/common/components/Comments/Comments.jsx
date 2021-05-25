import React from 'react';
import { Card } from '@tt-dclm/dclm-web-ui';
import AddComment from './AddComment';
import UserComments from './UserComments';

const Comments = ({ titleData, comments = [], onAddComment }) => {
  return (
    <>
      <AddComment onNoteAdd={onAddComment} commentsLength={comments.length} />
      <UserComments data={comments || []} />
    </>
  );
};
export default Comments;
