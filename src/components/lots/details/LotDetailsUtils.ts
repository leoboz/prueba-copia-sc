
import { Sample, TestResult } from '@/types';

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'No disponible';
  }
};

export const getLatestSample = (samples: Sample[]): Sample | null => {
  if (!samples || samples.length === 0) return null;
  return samples.reduce((latest, sample) => {
    const latestDate = latest ? new Date(latest.createdAt).getTime() : 0;
    const sampleDate = new Date(sample.createdAt).getTime();
    return sampleDate > latestDate ? sample : latest;
  }, null as Sample | null);
};

export const getStatusConfig = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'superior':
      return {
        label: 'Superior',
        className: 'bg-green-100 text-green-800',
        icon: 'CheckCircle',
      };
    case 'standard':
      return {
        label: 'Estándar',
        className: 'bg-blue-100 text-blue-800',
        icon: 'PackageCheck',
      };
    case 'retenido':
      return {
        label: 'Retenido',
        className: 'bg-red-100 text-red-800',
        icon: 'AlertTriangle',
      };
    default:
      return {
        label: 'Desconocido',
        className: 'bg-gray-100 text-gray-800',
        icon: 'HelpCircle',
      };
  }
};

export const getLatestTestResultsByParameter = (samples: Sample[]): Map<string, TestResult> => {
  const resultMap = new Map<string, TestResult>();

  if (!samples || samples.length === 0) {
    console.log('No samples provided to getLatestTestResultsByParameter');
    return resultMap;
  }

  console.log('Processing samples for latest test results:', samples.length);

  samples.forEach((sample, sampleIndex) => {
    console.log(`Processing sample ${sampleIndex + 1}:`, {
      id: sample.id,
      status: sample.status,
      hasTestResults: !!sample.test_results,
      testResultsCount: sample.test_results?.length || 0
    });

    if (sample.test_results && sample.test_results.length > 0) {
      sample.test_results.forEach((result: TestResult & { parameter?: any }) => {
        if (!result.parameterId) {
          console.log('Skipping result with missing parameterId:', result);
          return;
        }

        const currentLatest = resultMap.get(result.parameterId);
        const resultDate = new Date(result.createdAt).getTime();
        const currentDate = currentLatest ? new Date(currentLatest.createdAt).getTime() : 0;

        console.log(`Processing result for parameter ${result.parameterId}:`, {
          value: result.value,
          parameterName: result.parameter?.name,
          resultDate: new Date(result.createdAt).toISOString(),
          isNewer: !currentLatest || resultDate > currentDate
        });

        if (!currentLatest || resultDate > currentDate) {
          resultMap.set(result.parameterId, {
            ...result,
            parameter: result.parameter
          });
        }
      });
    }
  });

  console.log('Final latest test results by parameter:', Array.from(resultMap.entries()).map(([paramId, result]) => ({
    parameterId: paramId,
    parameterName: result.parameter?.name,
    value: result.value,
    createdAt: result.createdAt
  })));

  return resultMap;
};
