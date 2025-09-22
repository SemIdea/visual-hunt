const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="group rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4 rounded-full bg-primary/10 p-3 w-14 h-14 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <div className="text-primary">{icon}</div>
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureCard;
