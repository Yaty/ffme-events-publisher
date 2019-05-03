import PublisherOrchestrator from './publishers/PublisherOrchestrator';
import Facebook from './publishers/Facebook';
import Instagram from './publishers/Instagram';
import Wordpress from './publishers/Wordpress';
import FFME from './ffme/FFME';
import chalk from 'chalk';

(async () => {
  try {
    console.log(chalk.green('Démarrage du script !'));
    const ffme = new FFME();
    const data = await ffme.getData();

    const publisherOrchestrator = new PublisherOrchestrator(
      new Facebook(),
      new Instagram(),
      new Wordpress(),
    );

    await Promise.all([
      publisherOrchestrator.publishStages(data.stages),
      publisherOrchestrator.publishFormations(data.formations),
      publisherOrchestrator.publishCompetitions(data.competitions),
    ]);

    console.log(chalk.green(`Script terminé en ${process.uptime()}s !`));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

// TODO : https://github.com/nexe/nexe
// TODO : Avoir le lien de l'affiche en HD pour la mettre dans le post
