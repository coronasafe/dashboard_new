interface PageTitleProps {
  text: string;
}

const PageTitle = ({ text }: PageTitleProps) => {
  return (
    <h1 className="my-6 dark:text-gray-200 text-gray-700 text-2xl font-semibold">
      {text}
    </h1>
  );
};

export default PageTitle;
