
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shuffle, ThumbsUp, ThumbsDown, Music, Gamepad, Film, Book, Utensils, Camera } from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  description: string;
  duration: string;
  icon: JSX.Element;
  category: string;
}

const activities: Activity[] = [
  {
    id: '1',
    title: 'Listen to a New Playlist',
    description: 'Discover new music based on your favorite artists',
    duration: '30 mins',
    icon: <Music className="w-5 h-5" />,
    category: 'Music'
  },
  {
    id: '2',
    title: 'Quick Casual Game',
    description: 'Play a round of your favorite mobile or browser game',
    duration: '15 mins',
    icon: <Gamepad className="w-5 h-5" />,
    category: 'Games'
  },
  {
    id: '3',
    title: 'Watch a Short Film',
    description: 'Enjoy an award-winning short film or documentary',
    duration: '20 mins',
    icon: <Film className="w-5 h-5" />,
    category: 'Videos'
  },
  {
    id: '4',
    title: 'Read a Short Story',
    description: 'Enjoy a quick read from your favorite genre',
    duration: '25 mins',
    icon: <Book className="w-5 h-5" />,
    category: 'Reading'
  },
  {
    id: '5',
    title: 'Try a New Recipe',
    description: 'Make a simple snack or drink you haven\'t tried before',
    duration: '45 mins',
    icon: <Utensils className="w-5 h-5" />,
    category: 'Cooking'
  },
  {
    id: '6',
    title: 'Photography Mini-Session',
    description: 'Take creative photos of objects around you',
    duration: '20 mins',
    icon: <Camera className="w-5 h-5" />,
    category: 'Creative'
  }
];

const ActivitySuggestion = () => {
  const [currentActivity, setCurrentActivity] = useState<Activity>(activities[0]);
  const [likedActivities, setLikedActivities] = useState<string[]>([]);
  const [dislikedActivities, setDislikedActivities] = useState<string[]>([]);
  
  const getRandomActivity = () => {
    // Filter out already rated activities if possible
    const availableActivities = activities.filter(
      activity => !likedActivities.includes(activity.id) && !dislikedActivities.includes(activity.id)
    );
    
    // If all activities have been rated, just pick a random one
    const activitiesToChooseFrom = availableActivities.length > 0 ? availableActivities : activities;
    
    // Get a random activity different from the current one
    let newActivity;
    do {
      newActivity = activitiesToChooseFrom[Math.floor(Math.random() * activitiesToChooseFrom.length)];
    } while (activitiesToChooseFrom.length > 1 && newActivity.id === currentActivity.id);
    
    setCurrentActivity(newActivity);
  };
  
  const handleLike = () => {
    if (!likedActivities.includes(currentActivity.id)) {
      setLikedActivities([...likedActivities, currentActivity.id]);
    }
    getRandomActivity();
  };
  
  const handleDislike = () => {
    if (!dislikedActivities.includes(currentActivity.id)) {
      setDislikedActivities([...dislikedActivities, currentActivity.id]);
    }
    getRandomActivity();
  };

  return (
    <div className="space-y-6">
      <motion.div
        key={currentActivity.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-xl border border-border overflow-hidden"
      >
        <div className={`p-4 bg-fun/10 text-fun flex justify-between items-center`}>
          <div className="flex items-center gap-2">
            {currentActivity.icon}
            <span className="font-medium">{currentActivity.category}</span>
          </div>
          <span className="text-sm">{currentActivity.duration}</span>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">{currentActivity.title}</h3>
          <p className="text-muted-foreground mb-6">{currentActivity.description}</p>
          
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={handleDislike}
                className="p-2 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground"
              >
                <ThumbsDown className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleLike}
                className="p-2 rounded-full bg-fun/10 text-fun hover:bg-fun/20"
              >
                <ThumbsUp className="w-5 h-5" />
              </button>
            </div>
            
            <button
              onClick={getRandomActivity}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-fun text-white font-medium hover:bg-fun/90 transition-colors"
            >
              <Shuffle className="w-4 h-4" />
              <span>Next Activity</span>
            </button>
          </div>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <ThumbsUp className="w-4 h-4 text-fun" />
            <span>Liked Activities</span>
          </h3>
          
          {likedActivities.length > 0 ? (
            <ul className="space-y-2">
              {likedActivities.map(id => {
                const activity = activities.find(a => a.id === id);
                return activity ? (
                  <li key={id} className="text-sm text-muted-foreground flex items-center gap-2">
                    {activity.icon}
                    <span>{activity.title}</span>
                  </li>
                ) : null;
              })}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No liked activities yet</p>
          )}
        </div>
        
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <ThumbsDown className="w-4 h-4 text-muted-foreground" />
            <span>Disliked Activities</span>
          </h3>
          
          {dislikedActivities.length > 0 ? (
            <ul className="space-y-2">
              {dislikedActivities.map(id => {
                const activity = activities.find(a => a.id === id);
                return activity ? (
                  <li key={id} className="text-sm text-muted-foreground flex items-center gap-2">
                    {activity.icon}
                    <span>{activity.title}</span>
                  </li>
                ) : null;
              })}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No disliked activities yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivitySuggestion;
