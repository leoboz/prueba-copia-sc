
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ParameterTooltipProps {
  description: string;
}

const ParameterTooltip: React.FC<ParameterTooltipProps> = ({ description }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="h-4 w-4 ml-1 text-countryside-brown/60" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="w-64">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ParameterTooltip;
