import { FC } from "react";
import styled from "@emotion/styled";
import { useDocumentTitle } from "u@/useCallback";
import { useStores } from "x@";
import { BlogList } from "v@/Blog/List";

export const Home: FC = () => {
  const { sApp } = useStores();
  useDocumentTitle(`博客🍓｜${sApp.siteTag}`);

  return (
    <HomeBox>
      <BlogList />
    </HomeBox>
  );
};

const HomeBox = styled.div`
  width: 80rem;
`;
