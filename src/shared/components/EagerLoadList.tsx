import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import styled, { css } from 'styled-components';
import debounce from 'lodash.debounce';

interface IProps {
  children: React.ReactNode | React.ReactNode[];
  visibleItems: number;
}

export const EagerLoadList = ({ children, visibleItems }) => {
  const [page, setPage] = useState<number>(1);
  const [isLastItemVisible, setIsLastItemVisible] = useState(false);
  const visibleListSize = visibleItems * page;

  const totalItems = React.Children.count(children);
  const lastItemRef = useRef(null);

  const hasListEnded = visibleListSize >= totalItems;

  const lastItemVisibleChanged = useRef(
    debounce(isVisible => setIsLastItemVisible(isVisible), 500),
  ).current;

  const lastItemObserver = useMemo(
    () =>
      typeof window !== 'undefined' &&
      new IntersectionObserver(([entry]) => lastItemVisibleChanged(entry.isIntersecting)),
    [],
  );

  useEffect(() => {
    if (lastItemRef.current) {
      lastItemObserver && lastItemObserver.observe(lastItemRef.current);
    }

    return () => {
      lastItemObserver && lastItemObserver.disconnect();
    };
  }, [lastItemRef, lastItemObserver]);

  useEffect(() => {
    if (isLastItemVisible) {
      setPage(page + 1);
      setIsLastItemVisible(false);
    }
  }, [isLastItemVisible]);

  return (
    <React.Fragment>
      {React.Children.map(children, (child, index) => {
        const isVisible = index + 1 < visibleListSize;
        const isLast = index + 1 === totalItems;

        return (
          <EagerLoadList.Item
            ref={isLast ? lastItemRef : null}
            $visible={isLast ? !hasListEnded : isVisible}
          >
            {child}
          </EagerLoadList.Item>
        );
      })}
    </React.Fragment>
  );
};

EagerLoadList.Item = styled.div<{ $visible?: boolean }>`
  ${({ $visible }) =>
    !$visible &&
    css`
      display: none;
    `}
`;
