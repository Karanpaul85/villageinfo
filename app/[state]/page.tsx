type Props = {
  params: Promise<{
    state: string;
  }>;
};

export default async function StatePage({ params }: Props) {
  const { state } = await params;

  return (
    <div className="flex">
      <main className="flex">
        <div className="flex">State: {state}</div>
      </main>
    </div>
  );
}
