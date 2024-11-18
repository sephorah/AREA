import { AvailableArea, Service } from './protos/interfaces';

export enum ACTION {
  SPOTIFY_NEW_TRACK_SAVED = 'spotify.new_track_saved',
  SPOTIFY_NEW_SHOW_SAVED = 'spotify.new_show_saved',
  SPOTIFY_NEW_ALBUM_SAVED = 'spotify.new_album_saved',
  GITHUB_NEW_COMMIT_REPO = 'github.new_commit_repo',
  GITHUB_NEW_PULL_REQUEST_REPO = 'github.new_pull_request_repo',
  GITHUB_NEW_ISSUE_REPO = 'github.new_issue_repo',
  REDDIT_NEW_SAVED_POST = 'reddit.new_saved_post',
  REDDIT_NEW_UPVOTED_POST = 'reddit.new_upvoted_post',
  REDDIT_NEW_DOWNVOTED_POST = 'reddit.new_downvoted_post',
  WEATHER_TIME_AT_SELECTED_TIME = 'weather_time.at_selected_time',
  WEATHER_TIME_WEATHER_CHANGED = 'weather_time.weather_changed',
  DISCORD_GET_GUILDS_INFO = 'discord.get_guilds_info',
  DISCORD_USERNAME_CHANGED = 'discord.username_changed',
  DISCORD_NEW_SERVICE = 'discord.new_service',
  NOTION_NAME_CHANGED = 'notion.name_changed',
  NOTION_EMAIL_CHANGED = 'notion.email_changed',
  NOTION_OWNER_NAME_CHANGED = 'notion.owner_name_changed',
  NOTION_BLOCK_LAST_EDITED = 'notion.last_edited_block',
  NOTION_CHILDREN_BLOCK = 'notion.children_block',
  NOTION_PAGE_LAST_EDITED = 'notion.last_edited_page',
  NOTION_DATABASE_LAST_EDITED = 'notion.last_edited_database',
  NOTION_NEW_COMMENT_ON_BLOCK = 'notion.new_comment_on_block',
  YOUTUBE_NEW_LIKED_VIDEO = 'gmail.new_liked_video',
  YOUTUBE_NEW_SUBSCRIPTION = 'gmail.new_subscription',
  COIN_FLIP_HEADS = 'coinFlip.heads',
  COIN_FLIP_TAILS = 'coinFlip.tails',
  ISLAMIC_PRAYER_AT_TIME_SELECTED = 'islamic_prayer.at_time_selected',
  ISLAMIC_PRAYER_FAJR_TODAY = 'islamic_prayer.fajr_today',
  ISLAMIC_PRAYER_AT_TIMESTAMP = 'islamic_prayer.at_timestamp',
  ISLAMIC_PRAYER_AT_DATE = 'islamic_prayer.at_date',
}

export enum REACTION {
  GMAIL_SEND_EMAIL = 'gmail.send_email',
  GMAIL_SEND_EMAIL_TO_YOURSELF = 'gmail.send_email_to_yourself',
  REDDIT_SUBMIT_TEXT = 'reddit.submit_text',
  REDDIT_SUBMIT_LINK = 'reddit.submit_link',
  NOTION_POST_NEW_BLOCK = 'notion.post_new_block',
  NOTION_POST_NEW_COMMENT = 'notion.post_new_comment',
  NOTION_UPDATE_BLOCK = 'notion.update_block',
  NOTION_DELETE_BLOCK = 'notion.delete_block',
  NOTION_CREATE_PAGE = 'notion.create_page',
  NOTION_CREATE_DATABASE = 'notion.create_database',
  NOTION_UPDATE_DATABASE_TITLE = 'notion.update_database_title',
  SPOTIFY_START_RESUME_PLAYBACK = 'spotify.start_resume_playback',
  SPOTIFY_PAUSE_PLAYBACK = 'spotify.pause_playback',
  SPOTIFY_SKIP_TO_NEXT_MUSIC = 'spotify.skip_to_next_music',
  GITHUB_CREATE_ISSUE = 'github.create_issue',
  GITHUB_CREATE_ISSUE_COMMENT = 'github.create_issue_comment',
}

export const availableServices: Service[] = [
  {
    name: 'spotify',
  },
  {
    name: 'google',
  },
  {
    name: 'github',
  },
  {
    name: 'weather_time',
  },
  {
    name: 'discord',
  },
  {
    name: 'reddit',
  },
  {
    name: 'notion',
  },
  {
    name: 'islamic_prayer',
  },
  {
    name: 'coinFlip',
  },
];

export const availableActions: AvailableArea[] = [
  {
    name: ACTION.SPOTIFY_NEW_TRACK_SAVED,
    params: [],
    service: 'spotify',
    enDescription: 'Triggers every time you saved a track',
    frDescription:
      'Se déclenche à chaque fois que vous enregistrez une musique',
  },
  {
    name: ACTION.GITHUB_NEW_COMMIT_REPO,
    params: ['owner', 'repoName'],
    service: 'github',
    enDescription: 'Triggers every time you push a commit on a specific repo',
    frDescription:
      'Se déclenche à chaque fois que vous poussez un commit sur un dépôt spécifique',
  },
  {
    name: ACTION.GITHUB_NEW_PULL_REQUEST_REPO,
    params: ['owner', 'repoName'],
    service: 'github',
    enDescription:
      'Triggers every time a new pull request is opened on a specific repo',
    frDescription:
      'Se déclenche à chaque fois que une pull request est ouverte sur un dépôt spécifique',
  },
  {
    name: ACTION.GITHUB_NEW_ISSUE_REPO,
    params: ['owner', 'repoName'],
    service: 'github',
    enDescription:
      'Triggers every time a new issue is opened on a specific repo',
    frDescription:
      'Se déclenche à chaque fois que une nouvelle issue est ouverte sur un dépôt spécifique',
  },
  {
    name: ACTION.REDDIT_NEW_SAVED_POST,
    params: [],
    service: 'reddit',
    enDescription: 'Triggers every time you saved a comment or post',
    frDescription:
      'Se déclenche à chaque fois que vous enregistrez un post ou commentaire',
  },
  {
    name: ACTION.REDDIT_NEW_UPVOTED_POST,
    params: [],
    service: 'reddit',
    enDescription: 'Triggers every time you upvoted a post',
    frDescription: 'Se déclenche à chaque fois que vous "upvotez" un post',
  },
  {
    name: ACTION.REDDIT_NEW_DOWNVOTED_POST,
    params: [],
    service: 'reddit',
    enDescription: 'Triggers every time you downvoted a post',
    frDescription: 'Se déclenche à chaque fois que vous "downvotez" un post',
  },
  {
    name: ACTION.WEATHER_TIME_AT_SELECTED_TIME,
    params: ['selected_time'],
    service: 'weather_time',
    enDescription: 'Triggers when the time you choose matches the real time',
    frDescription:
      "Se déclanche quand l'horaire choisit correspond à celle actuelle",
  },
  {
    name: ACTION.WEATHER_TIME_WEATHER_CHANGED,
    params: [],
    service: 'weather_time',
    enDescription: 'Triggers when the temperature changed in celsius in Paris',
    frDescription: 'Se déclenche quand la température change à Paris',
  },
  {
    name: ACTION.DISCORD_GET_GUILDS_INFO,
    params: ['guild'],
    service: 'discord',
    enDescription: 'Triggers when your roles change on the server you choose',
    frDescription:
      'Se déclenche quand vos rôles changent sur le serveur discord que vous renseignez',
  },
  {
    name: ACTION.DISCORD_USERNAME_CHANGED,
    params: [],
    service: 'discord',
    enDescription: 'Triggers when your username changed',
    frDescription: "Se déclenche quand votre nom d'utilisateur change",
  },
  {
    name: ACTION.DISCORD_NEW_SERVICE,
    params: [],
    service: 'discord',
    enDescription: 'Triggers when you connect to a new service',
    frDescription:
      'Se déclenche quand vous vous connectez à un nouveau service (ex: twitch, youtube...)',
  },
  {
    name: ACTION.NOTION_NAME_CHANGED,
    params: [],
    service: 'notion',
    enDescription: 'Triggers when your name changed',
    frDescription: 'Se déclenche quand votre nom change',
  },
  {
    name: ACTION.NOTION_EMAIL_CHANGED,
    params: [],
    service: 'notion',
    enDescription: 'Triggers when your email changed',
    frDescription: 'Se déclenche quand votre email change',
  },
  {
    name: ACTION.NOTION_OWNER_NAME_CHANGED,
    params: [],
    service: 'notion',
    enDescription: "Triggers when the owner of the Notion's bot change",
    frDescription:
      'Se déclenche quand le nom du propriétaire du bot Notion change',
  },
  {
    name: ACTION.NOTION_BLOCK_LAST_EDITED,
    params: ['blockId'],
    service: 'notion',
    enDescription: 'Triggers when the block has change',
    frDescription: 'Se déclenche quand le block a été changé',
  },
  {
    name: ACTION.NOTION_CHILDREN_BLOCK,
    params: ['blockId'],
    service: 'notion',
    enDescription:
      'Triggers when a children block has been added to the choosen block',
    frDescription:
      'Se déclenche quand on ajoute un block enfant au block parent choisit',
  },
  {
    name: ACTION.NOTION_PAGE_LAST_EDITED,
    params: ['pageId'],
    service: 'notion',
    enDescription: 'Triggers when a page has been modify',
    frDescription: 'Se déclenche quand une page à été modifié',
  },
  {
    name: ACTION.NOTION_DATABASE_LAST_EDITED,
    params: ['databaseId'],
    service: 'notion',
    enDescription: 'Triggers when a database has been modify',
    frDescription: 'Se déclenche quand une base de donnée à été modifié',
  },
  {
    name: ACTION.NOTION_NEW_COMMENT_ON_BLOCK,
    params: ['blockId'],
    service: 'notion',
    enDescription: 'Triggers when a comment is added to the choosen block',
    frDescription:
      'Se déclenche quand un commentaire a été ajouté au block choisit',
  },
  {
    name: ACTION.YOUTUBE_NEW_LIKED_VIDEO,
    params: [],
    service: 'google',
    enDescription: 'Triggers every time you like a video',
    frDescription:
      'Se déclenche à chaque fois que vous mettez un pouce bleu à une vidéo',
  },
  {
    name: ACTION.YOUTUBE_NEW_SUBSCRIPTION,
    params: [],
    service: 'google',
    enDescription: 'Triggers every time you subscribe to a channel',
    frDescription:
      'Se déclenche à chaque fois que vous vous abonnez à une nouvelle chaîne',
  },
  {
    name: ACTION.ISLAMIC_PRAYER_AT_TIME_SELECTED,
    params: ['time'],
    service: 'islamic_prayer',
    enDescription: 'Triggers when choosen time is up',
    frDescription: "Se déclenche à l'heure choisit",
  },
  {
    name: ACTION.ISLAMIC_PRAYER_FAJR_TODAY,
    params: [],
    service: 'islamic_prayer',
    enDescription: 'Triggers at Fajr time',
    frDescription: "Se déclenche à l'heure de Fajr",
  },
  {
    name: ACTION.ISLAMIC_PRAYER_AT_TIMESTAMP,
    params: ['timestamp'],
    service: 'islamic_prayer',
    enDescription: 'Triggers at choosen timestamp',
    frDescription: "Se déclenche à l'horodatage choisit",
  },
  {
    name: ACTION.ISLAMIC_PRAYER_AT_DATE,
    params: ['date'],
    service: 'islamic_prayer',
    enDescription: 'Triggers at choosen date',
    frDescription: 'Se déclenche à la date choisit',
  },
  {
    name: ACTION.SPOTIFY_NEW_SHOW_SAVED,
    params: [],
    service: 'spotify',
    enDescription: 'Triggers every time you save a show',
    frDescription: 'Se déclenche à chaque fois que vous enregistrez un podcast',
  },
  {
    name: ACTION.COIN_FLIP_HEADS,
    params: [],
    service: 'coinFlip',
    enDescription: "Flip a coin and checks if it's on heads",
    frDescription: "Lance une pièce et regarde si c'est tombé sur pile",
  },
  {
    name: ACTION.COIN_FLIP_TAILS,
    params: [],
    service: 'coinFlip',
    enDescription: "Flip a coin and checks if it's on tails",
    frDescription: "Lance une pièce et regarde si c'est tombé sur face",
  },
];

export const availableReactions: AvailableArea[] = [
  {
    name: REACTION.GMAIL_SEND_EMAIL,
    params: ['recipient'],
    service: 'google',
    enDescription: 'Send a email',
    frDescription: 'Envoie un email',
  },
  {
    name: REACTION.GMAIL_SEND_EMAIL_TO_YOURSELF,
    params: [],
    service: 'google',
    enDescription: 'Send a email to yourself',
    frDescription: 'Envoie un email à vous-même',
  },
  {
    name: REACTION.REDDIT_SUBMIT_TEXT,
    params: ['subreddit'],
    service: 'reddit',
    enDescription: 'Submit a text-only post on a subreddit',
    frDescription: 'Soumet un post uniquement textuel sur un subreddit',
  },
  {
    name: REACTION.REDDIT_SUBMIT_LINK,
    params: ['subreddit'],
    service: 'reddit',
    enDescription: 'Submit a post with a link jon a subreddit',
    frDescription: 'Soumet un post avec un lien sur un subreddit',
  },
  {
    name: REACTION.NOTION_POST_NEW_BLOCK,
    params: ['text', 'page_id'],
    service: 'notion',
    enDescription:
      'Post a new block in the page you want with the text you want',
    frDescription:
      'Créer un nouveau block dans la page donnée avec le text donné',
  },
  {
    name: REACTION.NOTION_POST_NEW_COMMENT,
    params: ['pageId'],
    service: 'notion',
    enDescription: 'Post a new comment in the page you choose',
    frDescription: 'Créer un nouveau commentaire dans la page choisit',
  },
  {
    name: REACTION.NOTION_UPDATE_BLOCK,
    params: ['blockId'],
    service: 'notion',
    enDescription: 'Modify the block you choose',
    frDescription: 'Modifie le block choisit',
  },
  {
    name: REACTION.NOTION_DELETE_BLOCK,
    params: ['blockId'],
    service: 'notion',
    enDescription: 'Delete the block you choose',
    frDescription: 'Supprime le block choisit',
  },
  {
    name: REACTION.NOTION_CREATE_PAGE,
    params: ['pageId', 'title'],
    service: 'notion',
    enDescription: 'Create a new page inside one already created',
    frDescription: "Créer une nouvelle page a l'interieur d'une autre page",
  },
  {
    name: REACTION.NOTION_CREATE_DATABASE,
    params: ['pageId', 'title'],
    service: 'notion',
    enDescription: 'Create a new database inside a choosen page',
    frDescription:
      "Créer une nouvelle base de données a l'interieur d'une autre page",
  },
  {
    name: REACTION.NOTION_CREATE_DATABASE,
    params: ['databaseId', 'title'],
    service: 'notion',
    enDescription: 'Update the database title',
    frDescription: 'Change le nom de votre base de donnée',
  },
  {
    name: REACTION.SPOTIFY_START_RESUME_PLAYBACK,
    params: [],
    service: 'spotify',
    enDescription:
      'Start or resume the current playback. Only available for Spotify Premium accounts.',
    frDescription:
      'Joue la musique actuelle du lecteur de musique. Seulement disponible pour les comptes Spotify Premium.',
  },
  {
    name: REACTION.SPOTIFY_PAUSE_PLAYBACK,
    params: [],
    service: 'spotify',
    enDescription:
      'Pause the current playback. Only available for Spotify Premium accounts.',
    frDescription:
      'Met sur pause la musique jouée actuellement. Seulement disponible pour les comptes Spotify Premium.',
  },
  {
    name: REACTION.SPOTIFY_SKIP_TO_NEXT_MUSIC,
    params: [],
    service: 'spotify',
    enDescription:
      'Skip to the next music in the current playback queue. Only available for Spotify Premium accounts.',
    frDescription:
      'Passe à la prochaine musique du lecteur. Seulement disponible pour les comptes Spotify Premium.',
  },
  {
    name: REACTION.GITHUB_CREATE_ISSUE,
    params: ['owner', 'repoName'],
    service: 'github',
    enDescription: 'Create an issue on a repository you specify.',
    frDescription: 'Crée une issue sur un dépôt que vous spécifiez.',
  },
  {
    name: REACTION.GITHUB_CREATE_ISSUE_COMMENT,
    params: ['owner', 'repoName', 'issueNumber'],
    service: 'github',
    enDescription: 'Create a comment on a issue you specify.',
    frDescription: 'Crée un commentaire sur une issue que vous spécifiez.',
  },
];
