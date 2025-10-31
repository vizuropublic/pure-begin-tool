import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface InventoryFiltersProps {
  filterType: string;
  setFilterType: (value: string) => void;
  filterPossibility: string;
  setFilterPossibility: (value: string) => void;
  filterLocation: string;
  setFilterLocation: (value: string) => void;
  filterSource: string;
  setFilterSource: (value: string) => void;
  onSetAsDefault: () => void;
  isVisible: boolean;
  inventory: Array<{ location: string, source: string }>;
}

export const InventoryFilters = ({
  filterType,
  setFilterType,
  filterPossibility,
  setFilterPossibility,
  filterLocation,
  setFilterLocation,
  filterSource,
  setFilterSource,
  onSetAsDefault,
  isVisible,
  inventory,
}: InventoryFiltersProps) => {
  // Get unique locations from inventory data
  const uniqueLocations = Array.from(new Set(inventory.map(item => item.location))).sort();
  // Get unique sources from source data
  const uniqueSources = Array.from(new Set(inventory.map(item => item.source))).sort();
  if (!isVisible) return null;
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
          <Button onClick={onSetAsDefault} variant="outline" size="sm" className="w-full sm:w-auto">
            Reset to Default
          </Button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Type</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Transmission">Transmission</SelectItem>
                  <SelectItem value="Engine">Engine</SelectItem>
                  <SelectItem value="Brake">Brake</SelectItem>
                  <SelectItem value="Cooling">Cooling</SelectItem>
                  <SelectItem value="Exhaust">Exhaust</SelectItem>
                  <SelectItem value="Suspension">Suspension</SelectItem>
                  <SelectItem value="Filter">Filter</SelectItem>
                  <SelectItem value="Steering">Steering</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="Lighting">Lighting</SelectItem>
                  <SelectItem value="Fuel">Fuel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Possibility</label>
              <Select value={filterPossibility} onValueChange={setFilterPossibility}>
                <SelectTrigger>
                  <SelectValue placeholder="All Possibilities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Possibilities</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
              <Select value={filterLocation} onValueChange={setFilterLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {uniqueLocations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Source</label>
              <Select value={filterSource} onValueChange={setFilterSource}>
                <SelectTrigger>
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {uniqueSources.map(source => (
                    <SelectItem key={source} value={source}>{source}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>
        </div>
      </CardContent>
    </Card>
  );
};