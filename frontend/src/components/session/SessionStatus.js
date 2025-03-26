import React from 'react';

const SessionStatus = ({ session, predictions }) => {
  if (!session) return null;

  const totalParticipants = session.maxPlayers; // استخدام الحد الأقصى للاعبين بدلاً من عدد المشاركين الحالي
  const predictionsCount = predictions ? predictions.length : 0;
  const isPending = predictionsCount < totalParticipants;

  return (
    <div className={`status-bar ${isPending ? 'status-pending' : 'status-complete'}`}>
      {isPending ? (
        <>
          <i className="fas fa-hourglass-half"></i>
          <span style={{ marginRight: '8px' }}>
            في انتظار التوقعات... ({predictionsCount} من {totalParticipants})
          </span>
        </>
      ) : (
        <>
          <i className="fas fa-check-circle"></i>
          <span style={{ marginRight: '8px' }}>
            تم استلام جميع التوقعات ({predictionsCount} من {totalParticipants})
          </span>
        </>
      )}
    </div>
  );
};

export default SessionStatus;