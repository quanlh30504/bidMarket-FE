export const CreationAgreement = ({createButtonName}) => {
  return (
    <div className="mb-10 border-t pt-4 text-center">
      <h2 className="text-2xl font-bold">Create for free</h2>
      <p className="w-2/3 m-auto">
        By clicking {createButtonName}, you agree to our{" "}
        <a href="/#" className="text-blue-500">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/#" className="text-blue-500">
          Privacy Policy
        </a>
        . You agree to be responsible for the accuracy of the product infomation
        and to comply with all applicable laws and regulations.
      </p>
    </div>
  );
};
