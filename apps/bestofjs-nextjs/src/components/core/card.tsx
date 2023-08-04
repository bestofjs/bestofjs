export const Card = ({ children }: { children: React.ReactNode }) => {
  return <div className="rounded-lg border">{children}</div>;
};

export const CardHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="border-b p-4">{children}</div>;
};

export const CardBody = ({ children }: { children: React.ReactNode }) => {
  return <div className="divide-y divide-dashed">{children}</div>;
};

export const CardSection = ({ children }: { children: React.ReactNode }) => {
  return <div className="p-4">{children}</div>;
};
