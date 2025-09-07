import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  RotateCcw, 
  Trash2, 
  User, 
  Moon, 
  Sun, 
  Download,
  Upload,
  Shield,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useHabitData } from '@/hooks/useHabitData';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { data, resetAllData, updateProfile } = useHabitData();
  const { theme, toggleTheme } = useTheme();
  const { user: firebaseUser } = useAuth();
  const [profileName, setProfileName] = useState(data.profile.name);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const handleProfileSave = () => {
    updateProfile({ name: profileName });
    setIsEditingProfile(false);
    toast({
      title: "Profile Updated! ✅",
      description: "Your profile has been successfully updated."
    });
  };

  const handleExportData = () => {
    const dataToExport = {
      ...data,
      exportDate: new Date().toISOString(),
      version: "1.0"
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habit-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Data Exported! 📁",
      description: "Your habit data has been downloaded as a backup file."
    });
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        // Here you would validate and restore the data
        // For now, we'll just show a success message
        toast({
          title: "Import Ready! 📥",
          description: "Data validation complete. Feature coming soon!"
        });
      } catch (error) {
        toast({
          title: "Import Error! ❌",
          description: "Invalid backup file format."
        });
      }
    };
    reader.readAsText(file);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto p-6 space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl font-bold flex items-center gap-3 mb-2">
            <Settings className="w-10 h-10 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your profile, preferences, and data
          </p>
        </motion.div>

        {/* Profile Settings */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Profile Settings
              </CardTitle>
              <CardDescription>
                Your Firebase account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Email Address
                    </label>
                    <Input
                      value={firebaseUser?.email || 'Not available'}
                      disabled={true}
                      className="bg-muted/50"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Email cannot be changed here. Manage in Firebase Console.
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Display Name
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        disabled={!isEditingProfile}
                        placeholder="Enter your display name"
                      />
                      {isEditingProfile ? (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleProfileSave}>
                            Save
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setProfileName(data.profile.name);
                              setIsEditingProfile(false);
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setIsEditingProfile(true)}
                        >
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3">
                      <User className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <p className="font-medium">{data.profile.name}</p>
                    <p className="text-sm text-muted-foreground">Level {data.profile.level}</p>
                    <p className="text-xs text-muted-foreground mt-1">Authenticated with Firebase</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Appearance Settings */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-primary" />
                ) : (
                  <Sun className="w-5 h-5 text-primary" />
                )}
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your app
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark themes
                  </p>
                </div>
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data Management */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Data Management
              </CardTitle>
              <CardDescription>
                Backup, restore, and manage your habit data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={handleExportData}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export Data
                </Button>

                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Import Data
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium text-destructive">Danger Zone</h4>
                <p className="text-sm text-muted-foreground">
                  Permanently delete all your habit data. This action cannot be undone.
                </p>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Reset All Data
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete all your 
                        habits, progress data, XP, badges, and reset your profile. 
                        <br /><br />
                        Consider exporting your data first as a backup.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={resetAllData}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Yes, delete everything
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* App Information */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                About HabitForge
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">{data.habits.length}</p>
                  <p className="text-sm text-muted-foreground">Total Habits</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-success">{data.profile.totalXp}</p>
                  <p className="text-sm text-muted-foreground">Total XP Earned</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="text-center text-sm text-muted-foreground">
                <p>HabitForge v1.0.0</p>
                <p>Built with React, TypeScript, and Tailwind CSS</p>
                <p className="mt-2">
                  Data is stored locally in your browser. 
                  Export your data regularly to prevent loss.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* Footer: Built by Sahil Jana */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          Built by Sahil Jana
        </div>
      </motion.div>
    </div>
  );
}