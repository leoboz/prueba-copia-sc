
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { testStandardEvaluation, debugSampleLabels } from '@/utils/labelDebugHelper';
import { Bug } from 'lucide-react';

interface LabelDebuggerProps {
  sampleId: string;
  parameterId?: string;
}

const LabelDebugger: React.FC<LabelDebuggerProps> = ({ sampleId, parameterId }) => {
  const [testValue, setTestValue] = useState<number | ''>('');
  const [debugData, setDebugData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showDebugger, setShowDebugger] = useState(false);

  const handleTest = async () => {
    if (!parameterId || testValue === '') return;
    
    setLoading(true);
    try {
      const result = await testStandardEvaluation(parameterId, Number(testValue));
      setDebugData(result);
    } catch (error) {
      console.error('Error testing standard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDebugSample = async () => {
    setLoading(true);
    try {
      const result = await debugSampleLabels(sampleId);
      setDebugData(result);
    } catch (error) {
      console.error('Error debugging sample:', error);
    } finally {
      setLoading(false);
    }
  };

  // Only show in development mode
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="mt-4">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setShowDebugger(!showDebugger)}
      >
        <Bug className="mr-2 h-4 w-4" />
        {showDebugger ? 'Hide Debugger' : 'Show Label Debugger'}
      </Button>
      
      {showDebugger && (
        <Card className="mt-2 bg-gray-100">
          <CardHeader>
            <CardTitle className="text-sm">Label Assignment Debugger</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {parameterId && (
              <div className="space-y-2">
                <h4 className="text-xs font-medium">Test parameter with value:</h4>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    value={testValue}
                    onChange={(e) => setTestValue(e.target.value ? Number(e.target.value) : '')}
                    className="w-28 text-xs"
                    placeholder="Enter value"
                  />
                  <Button size="sm" onClick={handleTest} disabled={loading}>
                    Test
                  </Button>
                </div>
              </div>
            )}
            
            <div>
              <Button 
                size="sm" 
                onClick={handleDebugSample} 
                disabled={loading}
                className="w-full"
              >
                Debug Sample Labels
              </Button>
            </div>
            
            {loading && <p className="text-xs text-gray-500">Loading...</p>}
            
            {debugData && (
              <Collapsible className="text-xs">
                <CollapsibleTrigger className="w-full text-left">
                  <div className="flex justify-between items-center p-2 bg-gray-200 rounded">
                    <span>Debug Results</span>
                    <span>Click to expand/collapse</span>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <pre className="p-2 bg-black text-green-400 overflow-auto max-h-96 rounded mt-2">
                    {JSON.stringify(debugData, null, 2)}
                  </pre>
                </CollapsibleContent>
              </Collapsible>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LabelDebugger;
