export default function TabNavigation() {
  return (
    <div className="border-b border-border">
      <div className="flex gap-6 px-4">
        <div className="relative pb-3 pt-4 text-[15px] font-medium text-primary" data-testid="tab-all">
          All items
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-t-sm" />
        </div>
      </div>
    </div>
  );
}
