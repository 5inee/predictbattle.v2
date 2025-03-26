import React from 'react';

const SessionStatus = ({ session, predictions }) => {
  if (!session) return null;

  const totalParticipants = session.maxPlayers;
  
  // استخدام عدد التوقعات من predictions إذا كان متاحًا
  // أو من session.predictionsCount إذا تم تعيينه
  // أو 0 كملاذ أخير
  const predictionsCount = predictions?.length || session.predictionsCount || 0;
  
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