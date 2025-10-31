const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4 px-4">
        <div className="inline-block">
          <div className="h-px w-12 bg-primary mx-auto mb-8 animate-pulse" />
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold text-foreground tracking-tight">
          Blank Canvas
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Ready for your next idea
        </p>
      </div>
    </div>
  );
};

export default Index;
