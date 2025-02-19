export default function IssueCardGrid() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index} className="border rounded p-4">
          Issue Card {index + 1}
        </div>
      ))}
    </div>
  )
}
