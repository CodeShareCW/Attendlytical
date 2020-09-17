//This is a helper function to conditionally determine the fetch status

import { LoadingOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';

export const FetchChecker = ({
  loading,
  payload,
  fetchedDone,
  allLoadedMessage,
  noItemMessage,
  handleFetchMore,
}) => {
  return (
    <div>
      {payload.length > 0 && !fetchedDone && (
        <Button onClick={handleFetchMore} disabled={loading}>
          Load More
          {loading ? <LoadingOutlined /> : null}
        </Button>
      )}

      {!loading && payload?.length !== 0 && fetchedDone && (
        <div className='allLoadedCard'>
          <h3>{allLoadedMessage}</h3>
        </div>
      )}

      {!loading && payload?.length === 0 && <p>{noItemMessage}</p>}
    </div>
  );
};
