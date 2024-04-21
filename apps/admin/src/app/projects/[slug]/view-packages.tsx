import { getProjectBySlug } from "@/database/projects/get";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  project: Required<Awaited<ReturnType<typeof getProjectBySlug>>>;
};

export function ViewProjectPackages({ project }: Props) {
  const packages = project?.packages;
  if (!packages) return null;
  return (
    <div>
      {packages.map((pkg) => (
        <ViewPackage key={pkg.name} pkg={pkg} />
      ))}
    </div>
  );
}

function ViewPackage({ pkg }: { pkg: Props["project"]["packages"][number] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {pkg.name}
          <Badge>{pkg.version}</Badge>
          {pkg.deprecated && <Badge variant="destructive">Deprecated</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pkg.dependencies.length > 0 ? (
          <>
            <p className="mb-2 text-xl">Dependencies</p>
            <ul>
              {pkg.dependencies.map((dep) => (
                <li key={dep}>{dep}</li>
              ))}
            </ul>
          </>
        ) : (
          <div className="text-xl italic">No dependencies</div>
        )}
      </CardContent>
    </Card>
  );
}
