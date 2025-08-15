import { useState, useEffect } from 'react';
import { Timer } from '@/components/Timer';
import { ScrambleDisplay } from '@/components/ScrambleDisplay';
import { Statistics } from '@/components/Statistics';
import { SessionManager } from '@/components/SessionManager';
import { TimesList } from '@/components/TimesList';
import { generateScramble } from '@/lib/scramble-generator';
import { toast } from 'sonner';

const Index = () => {
  const [times, setTimes] = useState<number[]>([]);
  const [currentSession, setCurrentSession] = useState('Session 1');
  const [cubeType, setCubeType] = useState('3x3');
  const [scramble, setScramble] = useState('');
  const [useInspection, setUseInspection] = useState(false);

  // Generate initial scramble
  useEffect(() => {
    setScramble(generateScramble(cubeType));
  }, [cubeType]);

  const handleTimeRecord = (time: number) => {
    setTimes(prev => [...prev, time]);
    // Generate new scramble after each solve
    setScramble(generateScramble(cubeType));
    toast.success('Time recorded!');
  };

  const handleSessionChange = (newSession: string) => {
    setCurrentSession(newSession);
    setTimes([]); // Clear times when switching sessions
  };

  const handleCubeTypeChange = (newCubeType: string) => {
    setCubeType(newCubeType);
    setScramble(generateScramble(newCubeType));
  };

  const handleClearSession = () => {
    setTimes([]);
  };

  const handleDeleteTime = (index: number) => {
    setTimes(prev => prev.filter((_, i) => i !== index));
    toast.success('Time deleted');
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            CSTimer Pro
          </h1>
          <p className="text-muted-foreground">
            Professional speedcubing timer with modern design
          </p>
        </div>

        {/* Main Timer Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Timer and Scramble */}
          <div className="lg:col-span-2 space-y-6">
            <Timer 
              onTimeRecord={handleTimeRecord}
              useInspection={useInspection}
            />
            
            <ScrambleDisplay
              cubeType={cubeType}
              scramble={scramble}
              onScrambleChange={setScramble}
            />
          </div>

          {/* Right Column - Statistics and Controls */}
          <div className="space-y-6">
            <Statistics 
              times={times}
              currentSession={currentSession}
            />
            
            <SessionManager
              currentSession={currentSession}
              cubeType={cubeType}
              onSessionChange={handleSessionChange}
              onCubeTypeChange={handleCubeTypeChange}
              onClearSession={handleClearSession}
            />
          </div>
        </div>

        {/* Times List */}
        <TimesList 
          times={times}
          onDeleteTime={handleDeleteTime}
        />
      </div>
    </div>
  );
};

export default Index;
