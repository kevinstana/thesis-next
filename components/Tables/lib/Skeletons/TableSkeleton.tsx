import { Skeleton } from "@/components/ui/skeleton";

export default function TableSkeleton() {
    return (
          <div className="overflow-hidden bg-dark-bg-secondary rounded-lg mx-auto max-w-full lg:w-[80vw]">
            <div className="overflow-none">
              <table className="w-full">
                <thead>
                  <tr>
                      <th
                        className="px-4 py-3"
                      >
                        <Skeleton className="h-6" />
                      </th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(9)].map((_, rowIndex) => (
                    <tr key={rowIndex}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <Skeleton className="h-6 w-full" />
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
      );
}
