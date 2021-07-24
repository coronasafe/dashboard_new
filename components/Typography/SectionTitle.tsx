interface SectionTitleProps {
  text: string;
}

const SectionTitle = ({ text }: SectionTitleProps) => {
  return (
    <h2 className="mb-4 dark:text-gray-300 text-gray-600 text-lg font-semibold">
      {text}
    </h2>
  );
};

export default SectionTitle;
