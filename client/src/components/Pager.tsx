import styled from "@emotion/styled";
import {
  StepBackwardOutlined, StepForwardOutlined
} from "@ant-design/icons";

export const Pager = (props: {
  pagerParams: {
    pageNo: number;
    pageSize: number;
    total: number;
  };
  pageJump: (direction: string) => void;
}) => {
  const { pagerParams, pageJump } = props;
  return (
    <PagerBox>
      {pagerParams.pageNo > 1 && (
        <PrevBox onClick={() => pageJump("prev")}>
          <StepBackwardOutlined /> Previous
        </PrevBox>
      )}
      {pagerParams.pageNo * pagerParams.pageSize < pagerParams.total && (
        <NextBox onClick={() => pageJump("next")}>
          Next <StepForwardOutlined />
        </NextBox>
      )}
    </PagerBox>
  );
};

const PagerBox = styled.div`
  padding: 5rem 0.5rem 1rem;
`;
const PageItem = styled.div`
  border: 1px solid #999;
  padding: 1rem 2rem;
  border-radius: 1rem;
  cursor: pointer;
  font-size: 1.3rem;
  &:hover {
    color: #1aa567;
    border: 1px solid #1aa567;
  }

  .anticon {
    font-size: 1.2rem;
  }
`;
const PrevBox = styled(PageItem)`
  float: left;
`;
const NextBox = styled(PageItem)`
  float: right;
`;
