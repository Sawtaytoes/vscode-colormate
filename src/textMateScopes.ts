export const createIsInTextMateScope = (
  sourceScopeName: string,
) => {
  const rootScopeName = (
    (
      sourceScopeName
      .match(
        /.+(\..+)/
      )
      ?.slice(
        1
      )
      .find(
        Boolean
      )
    )
    || ''
  )

  return (
    parentTextMateScope: string,
    childTextMateScope: string,
  ) => (
    parentTextMateScope
    .startsWith(
      (
        childTextMateScope
        .endsWith(
          rootScopeName
        )
      )
      ? (
        childTextMateScope
        .slice(
          0,
          -(
            rootScopeName
            .length
          ),
        )
      )
      : childTextMateScope
    )
  )
}
