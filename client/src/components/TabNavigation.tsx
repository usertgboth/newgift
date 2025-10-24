export default function TabNavigation() {
  return (
    <div className="border-b border-border">
      <div className="flex gap-4 sm:gap-6 px-3 sm:px-4">
        <div className="relative pb-2.5 sm:pb-3 pt-3 sm:pt-4 text-sm sm:text-[15px] font-medium text-primary" data-testid="tab-all">
          All items
          <div className="absolute bottom-0 left-0 right-0 h-[2.5px] sm:h-[3px] bg-primary rounded-t-sm" />
        </div>
      </div>
    </div>
  );
}
