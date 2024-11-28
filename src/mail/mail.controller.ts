import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Subscriber, SubscriberDocument } from 'src/subscribers/schemas/subscriber.schemas';
import { Job, JobDocument } from 'src/jobs/schemas/job.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';

// https://docs.nestjs.com/techniques/task-scheduling
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService,
    private mailerService: MailerService,

    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<SubscriberDocument>,

    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>,


  ) {
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  testCron() {
    console.log("testCron started on ");
  }

  @Get()
  @Public()
  @ResponseMessage("Test email")
  @Cron("0 10 0 * * 0") // vào lúc 0h 10 phút' am every sunday
  async handleTestEmail() {
    const subscribers = await this.subscriberModel.find({});
    console.log("Test email ===============================================================", subscribers);
    for (const subs of subscribers) {
      const subsSkills = subs.skills;
      const jobWithMatchingSkills = await this.jobModel.find({ skills: { $in: subsSkills } });
      console.log("jobWithMatchingSkills ====================================================", jobWithMatchingSkills);
      if (jobWithMatchingSkills?.length) {
        console.log("Test email ===============================================================");
        const jobs = jobWithMatchingSkills.map(item => {
          return {
            name: item.name,
            company: item.company.name,
            salary: `${item.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " đ",
            skills: item.skills
          }
        })

        await this.mailerService.sendMail({
          to: "baothi3131@gmail.com",
          from: '"Support Team" <support@example.com>', // override default from
          subject: 'Welcome to Nice App! Confirm your Email',
          template: "new-job",
          context: {
            receiver: subs.name,
            jobs: jobs
          }
        });
      }
    }



  }

}
